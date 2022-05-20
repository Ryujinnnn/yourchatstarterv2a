from vncorenlp import VnCoreNLP
from keras.preprocessing.sequence import pad_sequences
import random
from tqdm import tqdm
import pickle
from torch.utils.data import TensorDataset, DataLoader, RandomSampler, SequentialSampler
import torch
import numpy as np
from sklearn.metrics import f1_score, accuracy_score, confusion_matrix
import os
from transformers import RobertaForSequenceClassification, RobertaConfig, AdamW, RobertaTokenizer, RobertaTokenizerFast, RobertaModel, AutoTokenizer
from datetime import datetime
import glob


def make_mask(batch_ids):
    batch_mask = []
    for ids in batch_ids:
        mask = [int(token_id > 0) for token_id in ids]
        batch_mask.append(mask)
    return torch.tensor(batch_mask)


def dataloader_from_text(text_file=None, tokenizer=None, classes=[], savetodisk=None, loadformdisk=None, segment=False,
                         max_len=128, batch_size=16, infer=False):
    ids_padded, masks, labels = [], [], []
    if loadformdisk == None:
        # segementer
        if segment:
            rdrsegmenter = VnCoreNLP("./VnCoreNLP/VnCoreNLP-1.1.1.jar", annotators="wseg", max_heap_size='-Xmx500m')
        texts = []
        print("Loading csv file")
        with open(text_file, 'r', encoding='utf-8') as reading_file:
            for sample in tqdm(reading_file):
                if infer:
                    text = sample.strip()
                    if segment:
                        text = rdrsegmenter.tokenize(text)
                        text = ' '.join([' '.join(x) for x in text])
                    texts.append(text)
                else:
                    splits = sample.strip().split(",", -1)
                    label = classes.index(splits[len(splits) - 1])
                    text = ""
                    for i in range(len(splits) - 1):
                        text += splits[i]
                    text = text.replace('\"', "").replace(",", " ,").replace("?", " ?")
                    if segment:
                        text = rdrsegmenter.tokenize(text)
                        text = ' '.join([' '.join(x) for x in text])
                    labels.append(label)
                    texts.append(text)

        print("Encoding text data to input id")

        ids = []
        for text in tqdm(texts):
            # encode the sentence into list of word id (add bos and eos in the process)
            encoded_sent = tokenizer.encode('<s> ' + text + ' </s>')
            ids.append(encoded_sent)

        del texts
        print("Padding ids")
        ids_padded = pad_sequences(ids, maxlen=max_len, dtype="long", value=0, truncating="post", padding="post")
        del ids
        # print("CREATE MASK")
        # for sent in tqdm(ids_padded):
        #     masks.append(make_mask(sent))

        masks = []
        print('Creating mask')
        for sent in ids_padded:
            mask = [int(token_id > 0) for token_id in sent]
            masks.append(mask)

        if savetodisk != None and not infer:
            with open(savetodisk, 'wb') as f:
                pickle.dump(ids_padded, f)
                # pickle.dump(masks, f)
                pickle.dump(labels, f)
            print("Saved padded data to disk")
    else:
        print("Loadding padded data from disk")
        if loadformdisk != None:
            try:
                with open(savetodisk, 'rb') as f:
                    ids_padded = pickle.load(ids_padded, f)
                    # masks = pickle.load(masks, f)
                    labels = pickle.load(labels, f)
                print("Loaded padded data from disk")
            except:
                print("Error: Loading padded data from disk")

    print("Converting to torch tensor")
    ids_inputs = torch.tensor(ids_padded)
    del ids_padded
    masks_inputs = torch.tensor(masks)
    del masks

    if not infer:
        labels = torch.tensor(labels)

    print("Create data loader instance")
    if infer:
        input_data = TensorDataset(ids_inputs, masks_inputs)
        # input_data = TensorDataset(ids_inputs)
    else:
        input_data = TensorDataset(ids_inputs, masks_inputs, labels)
        # input_data = TensorDataset(ids_inputs, labels)
    input_sampler = SequentialSampler(input_data)
    dataloader = DataLoader(input_data, sampler=input_sampler, batch_size=batch_size)

    print("len dataloader:", len(dataloader))
    print("All data loaded")
    return dataloader

# def loss_fn(outputs, targets):
#     return torch.nn.BCEWithLogitsLoss()(outputs, targets)

class BERTClassifier(torch.nn.Module):
    def __init__(self, num_labels):
        super(BERTClassifier, self).__init__()
        bert_classifier_config = RobertaConfig.from_pretrained(
            "./phobert-base/config.json",
            from_tf=False,
            num_labels=num_labels,
            output_hidden_states=False,
        )
        print("Loading pre-trained PhoBERT model")
        self.bert_classifier = RobertaForSequenceClassification.from_pretrained(
            "./phobert-base/pytorch_model.bin",
            config=bert_classifier_config
        )

    def forward(self, input_ids, attention_mask, labels):
        output = self.bert_classifier(input_ids=input_ids,
                                      token_type_ids=None,
                                      attention_mask=attention_mask,
                                      labels=labels,
                                      )
        return output


class ClassifierTrainner():
    def __init__(self, bert_model, train_dataloader, valid_dataloader, epochs=10, cuda_device="cpu", save_dir=None, use_mode=False):

        if cuda_device == "cpu":
            self.device = torch.device("cpu")
        else:
            self.device = torch.device('cuda:{}'.format(cuda_device))

        self.model = bert_model
        self.use_mode = use_mode
        if self.use_mode == False:
            if save_dir != None and os.path.exists(save_dir):
                print("Load weight from file:{}".format(save_dir))
                self.save_dir = save_dir
                epoch_checkpoint_path = glob.glob("{}/model_epoch*".format(self.save_dir))
                if len(epoch_checkpoint_path) == 0:
                    print("No checkpoint found in: {}\nCheck save_dir...".format(self.save_dir))
                else:
                    self.load_checkpoint(epoch_checkpoint_path)
                    print("Restore weight successful from: {}".format(epoch_checkpoint_path))
            else:
                self.save_dir = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
                os.makedirs(self.save_dir)
                print("Training new model, save to: {}".format(self.save_dir))

        self.train_dataloader = train_dataloader
        self.valid_dataloader = valid_dataloader
        self.epochs = epochs
        # self.batch_size = batch_size

    def save_checkpoint(self, save_path):
        state_dict = {'model_state_dict': self.model.state_dict()}
        torch.save(state_dict, save_path)
        print(f'Model saved to ==> {save_path}')

    def load_checkpoint(self, load_path):

        # WARNING: device to self.device
        state_dict = torch.load(load_path, map_location=self.device)
        print(f'Model restored from <== {load_path}')
        self.model.load_state_dict(state_dict['model_state_dict'])

    @staticmethod
    def flat_accuracy(preds, labels):
        pred_flat = np.argmax(preds, axis=1).flatten()
        labels_flat = labels.flatten()
        F1_score = f1_score(pred_flat, labels_flat, average='macro')
        return accuracy_score(pred_flat, labels_flat), F1_score

    def train_classifier(self):
        if self.use_mode == True:
            print("Model is in use mode, cannot train")
            return
        self.model.to(self.device)
        param_optimizer = list(self.model.named_parameters())
        no_decay = ['bias', 'LayerNorm.bias', 'LayerNorm.weight']
        optimizer_grouped_parameters = [
            {'params': [p for n, p in param_optimizer if not any(nd in n for nd in no_decay)], 'weight_decay': 0.01},
            {'params': [p for n, p in param_optimizer if any(nd in n for nd in no_decay)], 'weight_decay': 0.0}
        ]
        optimizer = AdamW(optimizer_grouped_parameters, lr=1e-5, correct_bias=False)

        best_valid_loss = 999999
        best_valid_loss_rate = 1
        best_valid_loss_epoch = -1
        best_eval_accuracy = 0
        best_eval_accuracy_rate = 0
        best_eval_accuracy_epoch = -1
        best_f1_score = 0
        best_f1_score_rate = 0
        best_f1_score_epoch = -1

        for epoch_i in range(0, self.epochs):
            print('======== Epoch {:} / {:} ========'.format(epoch_i + 1, self.epochs))
            print('Training...')

            # if epoch_i > 0:
            #     self.load_checkpoint("{}/model_best_valf1.pt".format(self.save_dir))
            total_loss = 0
            self.model.train()
            train_accuracy = 0
            nb_train_steps = 0
            train_f1 = 0

            for step, batch in enumerate(self.train_dataloader):
                b_input_ids = batch[0].to(self.device)
                b_input_mask = batch[1].to(self.device)
                b_labels = batch[2].to(self.device)

                self.model.zero_grad()
                outputs = self.model(b_input_ids,
                                     # token_type_ids=None,
                                     attention_mask=b_input_mask,
                                     labels=b_labels
                                     )
                loss = outputs[0]
                total_loss += loss.item()

                logits = outputs[1].detach().cpu().numpy()
                label_ids = b_labels.cpu().numpy()
                tmp_train_accuracy, tmp_train_f1 = self.flat_accuracy(logits, label_ids)
                train_accuracy += tmp_train_accuracy
                train_f1 += tmp_train_f1
                nb_train_steps += 1

                loss.backward()
                torch.nn.utils.clip_grad_norm_(self.model.parameters(), 1.0)
                optimizer.step()
                if step % 10 == 0:
                    print(
                        "[TRAIN] Epoch {}/{} | Batch {}/{} | Train Loss={} | Train Acc={}".format(epoch_i + 1, self.epochs,
                                                                                                  step, len(
                                self.train_dataloader), loss.item(), tmp_train_accuracy))

            avg_train_loss = total_loss / len(self.train_dataloader)
            print(" Train Accuracy: {0:.4f}".format(train_accuracy / nb_train_steps))
            print(" Train F1 score: {0:.4f}".format(train_f1 / nb_train_steps))
            print(" Train Loss: {0:.4f}".format(avg_train_loss))

            print("Running Validation...")
            self.model.eval()
            eval_loss, eval_accuracy = 0, 0
            nb_eval_steps, nb_eval_examples = 0, 0
            eval_f1 = 0

            for batch in self.valid_dataloader:

                batch = tuple(t.to(self.device) for t in batch)
                b_input_ids, b_input_mask, b_labels = batch

                with torch.no_grad():
                    outputs = self.model(b_input_ids,
                                         attention_mask=b_input_mask,
                                         # token_type_ids=None,
                                         labels=b_labels
                                         )
                    tmp_eval_loss, logits = outputs[0], outputs[1]
                    logits = logits.detach().cpu().numpy()
                    label_ids = b_labels.cpu().numpy()
                    tmp_eval_accuracy, tmp_eval_f1 = self.flat_accuracy(logits, label_ids)
                    eval_accuracy += tmp_eval_accuracy
                    eval_loss += tmp_eval_loss
                    eval_f1 += tmp_eval_f1
                    nb_eval_steps += 1

            print(" Valid Loss: {0:.4f}".format(eval_loss / nb_eval_steps))
            print(" Valid Accuracy: {0:.4f}".format(eval_accuracy / nb_eval_steps))
            print(" Valid F1 score: {0:.4f}".format(eval_f1 / nb_eval_steps))

            if best_valid_loss > eval_loss:
                best_valid_loss = eval_loss
                best_valid_loss_rate = eval_loss / nb_eval_steps
                best_valid_loss_epoch = epoch_i
                best_valid_loss_path = "{}/model_best_valoss.pt".format(self.save_dir)
                self.save_checkpoint(best_valid_loss_path)
            if best_eval_accuracy < eval_accuracy:
                best_eval_accuracy = eval_accuracy
                best_eval_accuracy_rate = eval_accuracy / nb_eval_steps
                best_eval_accuracy_epoch = epoch_i
                best_eval_accuracy_path = "{}/model_best_valacc.pt".format(self.save_dir)
                self.save_checkpoint(best_eval_accuracy_path)
            if best_f1_score < eval_f1:
                best_f1_score = eval_f1
                best_f1_score_rate = eval_f1 / nb_eval_steps
                best_f1_score_epoch = epoch_i
                best_eval_f1_path = "{}/model_best_valf1.pt".format(self.save_dir)
                self.save_checkpoint(best_eval_f1_path)

            epoch_i_path = "{}/model_epoch{}.pt".format(self.save_dir, epoch_i)
            self.save_checkpoint(epoch_i_path)
            if epoch_i > 0:
                os.remove("{}/model_epoch{}.pt".format(self.save_dir, epoch_i - 1))

        print("Training complete!")
        print("Best Loss: {} (Epoch {})".format(best_valid_loss_rate, best_valid_loss_epoch + 1))
        print("Best Accuracy: {} (Epoch {})".format(best_eval_accuracy_rate, best_eval_accuracy_epoch + 1))
        print("Best F1 Score: {} (Epoch {})".format(best_f1_score_rate, best_f1_score_epoch + 1))

    def predict_dataloader(self, dataloader, classes, tokenizer):
        for batch in dataloader:
            batch = tuple(t.to(self.device) for t in batch)
            b_input_ids, b_input_mask = batch
            with torch.no_grad():
                outputs = self.model(b_input_ids,
                                     attention_mask=b_input_mask,
                                     labels=None
                                     )
                logits = outputs
                logits = logits.detach().cpu().numpy()
                pred_flat = np.argmax(logits, axis=1).flatten()
                print("[PREDICT] {}:{}".format(classes[int(pred_flat)], tokenizer.decode(b_input_ids)))

    def predict_text(self, text, classes, tokenizer, max_len=128):

        def softmax(x):
            """Compute softmax values for each sets of scores in x."""
            e_x = np.exp(x - np.max(x))
            return e_x / e_x.sum(axis=0)  # only difference

        ids = tokenizer.encode('<s> ' + text + ' </s>')
        ids_padded = pad_sequences([ids], maxlen=max_len, dtype="long", value=0, truncating="post", padding="post")
        input_mask = make_mask(ids_padded).to(self.device)
        input_ids = torch.tensor(ids_padded)
        #input_mask = torch.tensor(mask)
        with torch.no_grad():
            outputs = self.model(input_ids,
                                attention_mask=input_mask,
                                labels=None
                                )
            logits = outputs['logits'].detach().cpu().numpy()
            print(softmax(logits[0]))
            pred_flat = np.argmax(logits, axis=1).flatten()

            return (classes[int(pred_flat)], softmax(logits[0])[int(pred_flat)])
#CLASS LIST
classes = ['positive', 'neutral', 'negative']


def main_train():
    MAX_LEN = 256
    tokenizer = AutoTokenizer.from_pretrained("./phobert-base", local_files_only=True)

    train_path = 'train.csv'
    test_path = 'test.csv'

    train_dataloader = dataloader_from_text(train_path, tokenizer=tokenizer, classes=classes, savetodisk=None, max_len=MAX_LEN, batch_size=8, segment=True)
    valid_dataloader = dataloader_from_text(test_path, tokenizer=tokenizer, classes=classes, savetodisk=None, max_len=MAX_LEN, batch_size=8, segment=True)

    #bert model
    bert_classifier_model = BERTClassifier(len(classes))
    #train model
    bert_classifier_trainer = ClassifierTrainner(bert_model=bert_classifier_model, train_dataloader=train_dataloader, valid_dataloader=valid_dataloader, epochs=10, cuda_device="cpu", save_dir='training_output') #cuda_device: "cpu"=cpu hoac 0=gpu0, 1=gpu1,
    bert_classifier_trainer.train_classifier()
    # bert_classifier_trainer.load_checkpoint('09-03-2022_17-44-01/model_best_valf1.pt')
    # bert_classifier_trainer.predict_text('Tạm biệt', classes=classes, tokenizer=tokenizer)
    # bert_classifier_trainer.predict_text('Xin chào', classes=classes, tokenizer=tokenizer)


def evaluate():
    # bert model
    texts = []
    labels = []
    MAX_LEN = 256
    rdrsegmenter = VnCoreNLP("./VnCoreNLP/VnCoreNLP-1.1.1.jar", annotators="wseg", max_heap_size='-Xmx500m')
    tokenizer = AutoTokenizer.from_pretrained("./phobert-base", local_files_only=True)
    bert_classifier_model = BERTClassifier(len(classes))
    bert_classifier_trainer = ClassifierTrainner(bert_model=bert_classifier_model, train_dataloader=None,
                                                 valid_dataloader=None, epochs=10, cuda_device="cpu", use_mode=True)
    bert_classifier_trainer.load_checkpoint('training_output/model_best_valoss.pt')

    with open("all.csv", 'r', encoding='utf-8') as reading_file:
        for sample in tqdm(reading_file):
            splits = sample.strip().split(",", 1)
            label = splits[1]
            text = splits[0]
            text = rdrsegmenter.tokenize(text)
            text = ' '.join([' '.join(x) for x in text])
            labels.append(label)
            texts.append(text)

    for i in range(len(texts)):
        pred_label = bert_classifier_trainer.predict_text(texts[i], classes=classes, tokenizer=tokenizer)
        print('{} is {}'.format(texts[i], pred_label) + ("(Expected to be {})".format(labels[i]) if pred_label != labels[i] else ""))


def main():
    mode = input("Bạn muốn train model mới (y/n): ")
    if (mode == "y"):
        main_train()
    else:
        #bert model
        MAX_LEN = 256
        rdrsegmenter = VnCoreNLP("./VnCoreNLP/VnCoreNLP-1.1.1.jar", annotators="wseg", max_heap_size='-Xmx500m')
        tokenizer = AutoTokenizer.from_pretrained("./phobert-base", local_files_only=True)
        bert_classifier_model = BERTClassifier(len(classes))
        bert_classifier_trainer = ClassifierTrainner(bert_model=bert_classifier_model, train_dataloader=None, valid_dataloader=None, epochs=10, cuda_device="cpu", use_mode=True)
        bert_classifier_trainer.load_checkpoint('training_output/model_best_valf1.pt')
        quit = False
        while (quit == False):
            txt = input('Nhập cụm cần phân loại (q để thoát): ')
            if (txt != "q"):
                txt = rdrsegmenter.tokenize(txt)
                txt = ' '.join([' '.join(x) for x in txt])
                pred_label = bert_classifier_trainer.predict_text(txt, classes=classes, tokenizer=tokenizer)
                print('Predicted label for {} is {}'.format(txt, pred_label))
            else:
                quit = True


# main()

# evaluate()