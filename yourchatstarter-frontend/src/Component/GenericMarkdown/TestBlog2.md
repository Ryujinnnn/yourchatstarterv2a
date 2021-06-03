Đã có bao giờ bạn tự hỏi "Làm thế nào để xây dựng một chatbot từ con số không?". Bài viết này sẽ hướng dẫn bạn đi qua việc thiết kế một hệ thống chatbot, cũng như giải quyết một số vấn đề gặp phải trong việc làm thế nào để giúp cho trải nghiệm chatbot trở nên thân thiện hơn. Đây là phần tiếp theo trong chuỗi bài hướng dẫn thiết kế Chatbot. Các bạn nên xem [Phần 1](#) trước khi tiếp tục với bài này nhé :-)

#### 6. Phản hồi theo khuôn mẫu và đổi ngôi trong trả lời
Tiếp tục với ví dụ dưới đây

> **Người dùng**: Bạn không hề có thật!
> **Chatbot**: Vậy bạn nghĩ tôi không hề có thật?
> **Người dùng**: Bạn chẳng biết cái gì cả
> **Chatbot**: Vậy bạn nghĩ tôi chẳng biết cái gì cả?

Ta thấy người dùng đưa ra 2 đầu vào rất khác nhau về mặt mục đích và khá chắc chắn rằng Chatbot của chúng ta không thể lường trước được những đầu vào này. Tuy nhiên với một vài kĩ thuật chuyển đổi ngôi từ và phản hồi theo khuôn mẫu, ta có thể giúp cho Chatbot đối phó được với những câu này một cách thuyết phục hơn. Một ví dụ về cách xử lý có thể như sau

* Thiết lập một khuôn mẫu phản hồi, ví dụ như “Vậy bạn nghĩ *” với dấu * tương ứng với một chuỗi bất kì (wildcard), ta có thể đưa nguyên câu nói của người dùng vào chuỗi wildcard này
* Ta lập một công thức chuyển đổi ngôn từ khi thiết lập câu từ khuôn mẫu trên. Ví dụ như nếu ta tìm thấy từ “Bạn”, “mày”, “anh”, “chị”, …(Đại từ nhân xưng ngôi thứ hai) biến đối các từ đó thành các đại từ nhân xưng ngôi thứ nhất (“Tôi”, “mình”) hoặc ngược lại, nếu tìm thấy đại từ nhân xưng ngôi thứ nhất, biến đổi nó thành đại từ nhân xưng ngôi thứ hai

Cần phải lưu ý rằng ta không nên lạm dụng cách làm này bởi vì những phản hồi như thế này thường ít khi tạo ra được giá trị trong cuộc trò chuyện giữa người và Chatbot. Nếu sử dụng nhiều người dùng sẽ dễ dàng nhận ra khuôn mẫu của Chatbot và ta lại rơi vào trường hợp trả lời rập khuôn, thô cứng

#### 7. Vị trí của từ khóa

Ta lại tiếp tục với ví dụ sau đây

```
Từ khóa: “Bạn là ai”
Phản hồi: “Tôi là Chatbot A”
```

Xét đoạn hội thoại sau

> **Người dùng**: Bạn là ai?
> **Chatbot**: Tôi là Chatbot A
> **Người dùng**: Bạn là ai mà dám lên mặt với tôi?
> **Chatbot**: Tôi là Chatbot A
> **Người dùng**: Ca sĩ yêu thích của bạn là ai?
> **Chatbot**: Tôi là Chatbot A
> **Người dùng**: Tôi biết bạn là ai. Rất vui được gặp bạn
> **Chatbot**: Tôi là Chatbot A

Vấn đề xảy ra ở đây chính là việc Chatbot không xác định được vị trí của từ khóa có thể làm ảnh hưởng đến ý nghĩa của đầu vào. Cách giải quyết ở đây sẽ là thêm vào kí hiệu để Chatbot biết được từ khóa đó nằm ở đâu trong câu thì sẽ dùng phản hồi đó. Với chuỗi ví dụ trên, ta có thể kí hiệu rằng nếu chuỗi “Bạn là ai” được tìm thấy ở đầu câu thì phản hồi “Tôi là Chatbot A” sẽ là phù hợp

#### 8. Xử lý ngữ cảnh

Tiếp đến ta xét đoạn hội thoại sau

> **Người dùng**: Ca sĩ yêu thích của bạn là ai?
> **Chatbot**: Tôi thích Lady Gaga
> **Người dùng**: Tại sao?
> **Chatbot**: Vì bộ đồ cô ấy mặc rất thú vị với tôi

Và đoạn hội thoại sau

> **Người dùng**: Tại sao?
> **Chatbot**: Tôi không hiểu bạn đang hỏi gì

Cùng là câu “Tại sao?” nhưng ta đang mong đợi Chatbot trả lời theo 2 hướng khác nhau. Tất cả dựa vào ngữ cảnh của cuộc trò chuyện. Để giữ cho ứng dụng đơn giản, ta sẽ chỉ xét ngữ cảnh là tập hợp tất cả các câu hội thoại giữa Chatbot và người dùng trong một ca giao tiếp. Ngữ cảnh ở đoạn hội thoại đầu tiên trước câu hỏi “Tại sao?” bao gồm việc người dùng đã hỏi Chatbot ai là ca sĩ mà chatbot yêu thích với câu trả lời nhận về là Lady Gaga. Vì vậy mà Chatbot có thể hiểu được câu hỏi sẽ là “Tại sao bạn thích ca sĩ Lady Gaga?” và có phản hồi tương ứng. Chính vì vậy lưu trữ ngữ cảnh cũng là một công việc quan trọng để tạo nên một Chatbot có thể giao tiếp ở mức thuyết phục

#### 9. Lưu trữ và sử dụng thông tin trong đoạn hội thoại

Tiếp tục xét đoạn hội thoại sau

> **Người dùng**: Chào bạn
> **Chatbot**: Chào bạn, bạn tên gì?
> **Người dùng**: Mình tên A
> **Chatbot**: Mình có thể giúp gì cho A?

Ở đây Chatbot đã chủ động hỏi người dùng họ tên gì, nếu người dùng trả lời đúng theo từ khóa mà Chatbot đã dự đoán (Ví dụ như “Tên tôi là *”, “Tên mình là *”, “Mình tên *”, …) Chatbot sẽ có thể lưu lại thông tin đó để tăng tính cá nhân của cuộc hội thoại

#### 10. Sử dụng API thông tin để xây dựng phản hồi

Cuối cùng ta xét đoạn hội thoại dưới đây

> **Người dùng**: Chào bạn
> **Chatbot**: Chào bạn, mình có thể giúp gì được cho bạn?
> **Người dùng**: Cho mình hỏi thời tiết ở thành phố X như thế nào
> **Chatbot**: Thời tiết nhiều mây, nhiệt độ 23.4 độ C nhé bạn

Ta thấy rằng, để xây dựng một chatbot cung cấp thông tin, ta sẽ phải có một tầng tìm kiếm thông tin từ các API khác để có thể soạn ra phản hồi cho người dùng.

#### Tổng kết

Như vậy thông qua các ví dụ trên, ta có thể giải quyết được một số trường hợp có thể làm cho Chatbot phản hồi một cách thiếu thuyết phục. Tuy nhiên quan trọng nhất chính là việc tạo ra một cơ sở kiến thức càng lớn càng tốt cho Chatbot để nó có thể phản hồi trước các đầu vào từ phía người dùng. Một số phương pháp có thể kể đến như sauư

* Nhà phát triển tự soạn ra các từ khóa và phản hồi tương ứng dựa theo mục đích của Chatbot
* Gợi ý người dùng các đầu vào có thể sử dụng để duy trì cuộc thảo luận giữa người dùng và Chatbot
* Khi gặp phải một chuỗi đầu vào không thể so khớp được với bất kì từ khóa nào, đưa ra một phản hồi chung và lưu đầu vào đó vào một cơ sở dữ liệu các đầu vào nó không thể xử lý. Nhà phát triển có thể lựa chọn  việc thêm đầu vào đó vào như một từ khóa với phản hồi tương ứng hoặc bỏ qua đầu vào đó
* Cho máy khả năng tự học. Ví dụ như việc nếu không thể so khớp từ khóa nào, Chatbot sẽ hỏi người dùng “Tôi phải trả lời thế nào?”. Câu trả lời của người dùng sẽ là phản hồi của Chatbot khi gặp lại từ khóa đó (Tuy nhiên cần phải hết sức cẩn thận khi sử dụng phương pháp này và chỉ nên sử dụng nó trong một môi trường có kiểm soát, đảm bảo không có tác nhân xấu tham gia)

Và cuối cùng, dù Chatbot có tốt đến mấy thì cũng sẽ còn trường hợp con người sẽ phải can thiệp, vì vậy ta có thể tạo điều kiện để một người thật có thể điều khiển Chatbot nếu cần thiết.

Cảm ơn các bạn đã đọc bài viết này. Mình sẽ hẹn gặp trong những bài viết tiếp theo. Chúc các bạn một ngày mới tốt lành
