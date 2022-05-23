import falcon
import json
import os
from transformers import AutoTokenizer, AutoModel
from vncorenlp import VnCoreNLP
from urllib.parse import unquote
from waitress import serve
from model_impl import *

class CORSComponent(object):
    def process_response(self, req, resp, resource, req_succeeded):
        resp.set_header('Access-Control-Allow-Origin', '*')
        if (req_succeeded
            and req.method == 'OPTIONS'
            and req.get_header('Access-Control-Request-Method')
        ):
            allow = resp.get_header('Allow')
            resp.delete_header('Allow')
            allow_headers = req.get_header('Access-Control-Request-Headers', default = '*')
            resp.set_headers((
                ('Access-Control-Allow-Methods', allow),
                ('Access-Control-Allow-Headers', allow_headers),
                ('Access-Control-Max-Age', '86400'),  # 24 hours
            ))

class ClassifyText(object):
    def __init__(self, tokenizer, wordsegmenter):
        self.classes = ['positive', 'neutral', 'negative']
        MAX_LEN = 256
        self.rdrsegmenter = wordsegmenter
        self.tokenizer = tokenizer
        self.bert_classifier_model = BERTClassifier(len(self.classes))
        self.bert_classifier_trainer = ClassifierTrainner(bert_model=self.bert_classifier_model, train_dataloader=None,
                                                     valid_dataloader=None,cuda_device="cpu",use_mode=True)
        self.bert_classifier_trainer.load_checkpoint('training_output/model_epoch9.pt')
        print('Model is ready to be used')

    def on_post(self, req, resp):
        data = json.load(req.bounded_stream)
        txt = unquote(data.get('text'))
        txt = self.rdrsegmenter.tokenize(txt)
        txt = ' '.join([' '.join(x) for x in txt])
        pred_res = self.bert_classifier_trainer.predict_text(txt, classes=self.classes, tokenizer=self.tokenizer)
        # print('Predicted label for {} is {}'.format(txt, pred_label))
        # print(tokens)
        # print(pred_res)
        result = {
            "segmented": txt,
            "intent": pred_res[0],
            "certainty": pred_res[1] * 100
        }
        resp.body=json.dumps(result, ensure_ascii=False)
        resp.status=falcon.HTTP_200

class TokenizeText(object):
    def __init__(self, tokenizer, wordsegmenter):
        self.rdrsegmenter = wordsegmenter
        self.tokenizer = tokenizer

    def on_post(self, req, resp):
        data = json.load(req.bounded_stream)
        txt = unquote(data.get('text'))
        txt = self.rdrsegmenter.tokenize(txt)
        txt = ' '.join([' '.join(x) for x in txt])
        token = self.tokenizer.tokenize(txt)
        # print('Predicted label for {} is {}'.format(txt, pred_label))
        # print(tokens)
        # print(pred_res)
        result = {
            "tokens": token
        }
        resp.body=json.dumps(result, ensure_ascii=False)
        resp.status=falcon.HTTP_200

class Ping:
    def on_get(self, req, resp):
        result = {
            "status": "success"
        }
        resp.body = json.dumps(result, ensure_ascii=False)
        resp.status = falcon.HTTP_200

wordsegmenter = VnCoreNLP("./VnCoreNLP/VnCoreNLP-1.1.1.jar", annotators="wseg",
                                 max_heap_size='-Xmx500m')
tokenizer = AutoTokenizer.from_pretrained("./phobert-base", local_files_only=True)

port = os.environ.get('PORT', '8000')
api = falcon.API(middleware=[CORSComponent()])

api.add_route('/classify', ClassifyText(tokenizer, wordsegmenter))
api.add_route('/tokenize', TokenizeText(tokenizer, wordsegmenter))
api.add_route('/ping', Ping())

# If you don't want to start the server from code but from shell, then use
# this code snippet:
#   waitress-serve --port=8000 app:api
serve(api, host='localhost', port=port)