Đã có bao giờ bạn tự hỏi "Làm thế nào để xây dựng một chatbot từ con số không?". Bài viết này sẽ hướng dẫn bạn đi qua việc thiết kế một hệ thống chatbot, cũng như giải quyết một số vấn đề gặp phải trong việc làm thế nào để giúp cho trải nghiệm chatbot trở nên thân thiện hơn

#### 1. Kiến trúc đơn giản nhất của Chatbot

Một Chatbot cơ bản sẽ gồm 2 thành phần chính
* Một hệ thống xử lý đầu vào
* Một hệ thống biên soạn đầu ra (phản hồi) của Chatbot  

Ví dụ cơ bản nhất có thể được mô tả như sau:

> **Người dùng**: Bạn khỏe không?
> **Chatbot**: Tôi khỏe

Ở đây đầu vào của người dùng là “Bạn khỏe không?” và phản hồi của Chatbot là “Tôi khỏe”. Ta có thể lập trình cho hệ thống xử lý đầu vào của Chatbot so khớp dữ liệu đầu vào với chuỗi “Bạn khỏe không?” và nếu kết quả so khớp là đúng, trả về xâu ký tự “Tôi khỏe”. Rõ ràng cách làm này bộc lộ nhiều vấn đề và ta sẽ đi lần lượt qua những vấn đề đó cũng như cách giải quyết chúng

#### 2. Sử dụng từ khóa (keyword)

Trước hết lấy ví dụ sau

> **Người dùng**: Bạn có khỏe không?

Ở đây rõ ràng người dùng có ý định hỏi giống như câu “Bạn khỏe không?” Tuy nhiên Chatbot sẽ không thể nhận ra được ý nghĩa của câu này nếu nó tiếp tục thực hiện so khớp với xâu “Bạn khỏe không?” (Kết quả so khớp sẽ là sai). Hướng giải quyết vấn đề này có thể bao gồm việc chỉ sử dụng từ khóa nhất định (Ví dụ như cụm từ “khỏe không”) và so khớp nó với bất kì chuỗi con nào trong câu hoặc sử dụng các thuật toán tìm chuỗi mờ (Fuzzy String Search) bằng cách chia các từ trong câu ra một chuỗi các từ, chia các câu từ khóa ra thành một chuỗi các từ khác. Sau đó tính toán [khoảng cách Levenshtein](http://stevehanov.ca/blog/index.php?id=114) để xác định khoảng cách nhỏ nhất hoặc khoảng cách nằm trong một giới hạn nhất định để thỏa mãn điều kiện so khớp với từ khóa. Trong thực tế ta có thể kết hợp cả 2 phương pháp này để tăng tỉ lệ Chatbot có thể xác định được từ khóa

#### 3. Xử lý vấn đề phản hồi lặp lại

Tiếp theo, ta xét ví dụ sau:

> **Người dùng**: Bạn khỏe không?
> **Chatbot**: Tôi khỏe
> **Người dùng**: Bạn khỏe không?
> **Chatbot**: Tôi khỏe
> **Người dùng**: Bạn khỏe không?
> **Chatbot**: Tôi khỏe

Ta dễ dàng thấy được vấn đề ở đây đó là: với đầu vào giống nhau, Chatbot sẽ trả về kết quả giống nhau. Điều này làm mất đi tính tự nhiên của một Chatbot và người dùng sẽ phàn nàn về việc phản hồi của nó là quá thô cứng (Canned response). Để giải quyết vấn đề này. Ta có thể tạo ra một tập hợp các phản hồi mà Chatbot có thể lựa chọn nếu từ khóa tương ứng được so khớp. Để tránh tình trạng lặp lại, ta có thể lưu phản hồi trước đó của Chatbot đối với từ khóa này và tránh phản hồi đó nếu gặp lại từ khóa đó lần tới 

#### 4. Xếp hạng từ khóa

Tiếp đến, ta xét trường hợp Chatbot được thiết kế như sau

```
Từ khóa: “Tên bạn là gì?”
Phản hồi: “Tên tôi là Chatbot A”
Từ khóa: “Bạn là gì?”
Phản hồi: “Tôi là một Chatbot”
```

Xét đoạn hội thoại sau

> **Người dùng**: Tên của bạn là gì?
> **Chatbot**: Tên tôi là Chatbot A

Ở ví dụ trên, đầu vào của người dùng sẽ trùng với cả 2 từ khóa “Tên bạn là gì?” và “Bạn là gì?”. Phản hồi nào mà Chatbot nên lựa chọn? Rõ ràng phải là phản hồi của từ khóa “Tên bạn là gì?”. Vì vậy ta cần phải có cách để xếp hạng các từ khóa sao cho Chatbot có thể chọn ra phản hồi phù hợp nhất. Cách đơn giản nhất ở đây sẽ là lựa chọn từ khóa có độ dài lớn nhất

#### 5. Cụm từ hoán đổi được cho nhau (Alias)

Ta tiếp tục xét ví dụ sau

> **Người dùng**: 1+1 bằng mấy?
> **Chatbot**: Bằng 2
> **Người dùng**: 2+1 bằng bao nhiêu?
> **Chatbot**: Bằng 3

Với ví dụ này, ta thấy từ khóa để yêu cầu tính toán có thể là “Bằng mấy” hoặc “Bằng bao nhiêu”, “mấy” và “bao nhiêu” có thể được sử dụng thay thế cho nhau. Vì vậy ta gọi chúng là từ khóa tương đương và ta sẽ phải tìm cách để biểu diễn chúng trong chương trình Chatbot của chúng ta

#### Kết luận

Như vậy thông qua việc giải quyết các vấn đề trên, bạn đã có thể thiết kế được một chatbot có thể phản hồi người dùng thông qua một số từ khóa nhất định cũng như giảm thiểu hoặc giải quyết các vấn đề cơ bản trong quá trình thiết kế đó. Trong phần tiếp theo chúng ta sẽ tiếp tục với những vấn đề cụ thể hơn cũng như một số thủ thuật giúp cho chatbot của chúng ta có thể phản hồi được với một số lượng lớn hơn những đầu vào của người dùng. Cảm ơn các bạn đã đón đọc và chúc bạn một ngày mới tốt lành :-)