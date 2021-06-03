Wit.ai là một Chatbot Framework đã được mua lại bởi Facebook và giờ đây miễn phí kể cả cho mục đích sử dụng thương mại. Nền tảng này cung cấp cho nhà phát triển cách thiết lập các intent và entity. Khởi đầu là một chatbot framework mã nguồn mở bởi Y Combinator Startup. Bởi vì nó vẫn đang là một dự án mã nguồn mở với bộ công cụ mở, nhà phát triển có thể dễ dàng tạo ra chatbot với trí tuệ ngang bằng với con người mà không cần phải dạy lại cho nó các quy tắc cơ bản của giao tiếp giữa người với người.

Trong bài viết này này ta sẽ chủ yếu làm việc với giao diện trực quan được cung cấp bởi https://wit.ai/ Bắt đầu bằng việc truy cập trang web này
Để sử dụng Wit.ai, ta cần phải có tài khoản Facebook. Sau khi đăng nhập vào tài khoản ta có thể tạo ứng dụng mới bằng cách chọn New App. Hộp thoại nhập thông tin ban đầu của ứng dụng bạn muốn tạo

![Alt text](https://i.ibb.co/dfxrJSR/image.png "Màn hình tạo app wit.ai mới")
 
Sau khi khởi tạo ứng dụng thành công, chỉ mục đầu tiên nhà phát triển thấy sẽ là mục Understanding

![Alt text](https://i.ibb.co/306s1JQ/image.png "Màn hình khởi đầu ở mục Understanding")

Để bắt đầu luyện chatbot, ta nhập một ví dụ về đầu vào người dùng có thể đưa ra. Ví dụ “Thời tiết ở Hà Nội như thế nào?” Sau đó chọn mục dropdown Intent. Ta thấy rằng ta chưa tạo một intent nào cả

![Alt text](https://i.ibb.co/ZWNqBs4/image.png "Mở Dropdown chọn Intent")

Để tạo intent mới, ta nhập tên intent muốn tạo nhấn vào ô Create intent để tạo intent mới. Sau khi tạo menu dropdown sẽ đóng lại đã chọn intent vừa tạo

![Alt text](https://i.ibb.co/9sqfHj1/image.png "Dropdown chọn Intent sau khi tạo Intent mới")
 
Sau khi đã chọn intent, tiếp theo ta cần cho chatbot nhận biết entity parameter ở đây là Hà Nội, ta bôi đen cụm “Hà Nội” trong ô nhập utterance sẽ hiện lên hộp thoại chọn entity

![Alt text](https://i.ibb.co/gwXHNh8/image.png "Thao tác chọn Entity với Keyword đã bôi đen")
 
Để thuận tiện, ta sẽ chọn entity có sẵn đó là wit/location, là một Build-in Entity của Wit.AI cho phép xác định các địa điểm và cửa số utterance sẽ hiện thị như dưới đây

![Alt text](https://i.ibb.co/gT41kxn/image.png "Màn hình mục Understanding sau khi chọn Entity")
 
Tiếp theo, để chọn trait cho câu, ta chọn ô Add trait để mở hộp thoại chọn trait. Như ta thấy ngoài trait có sẵn (wit/on\_off) thì không còn trait nào khác, vì vậy ta sẽ thêm trait mới tương tự như cách thêm intent mới, trait này sẽ có tên là “no\_detail”

![Alt text](https://i.ibb.co/qRKbjdc/image.png "Mở Dropdown chọn Trait")

Sau khi chọn trait vừa tạo thành công, ta sẽ chọn giá trị thể hiện của trait đó, ta muốn chọn tính chất đúng hoặc sai, vì vậy bấm vào menu dropdown chọn value rồi thêm giá trị mới như cách ta thêm intent hay thêm trait mới

![Alt text](https://i.ibb.co/fdyf8pZ/image.png "Mở Dropdown chọn giá trị cho Trait vừa tạo")
 
Sau khi nhập, ta có một utterance đã được phân tích đầy đủ như hình dưới, việc cần làm còn lại đó chính là nhấn nút Train and Validate

![Alt text](https://i.ibb.co/Yp3BfyZ/image.png "Màn hình mục Understanding với toàn bộ các dữ liệu đã thêm vào")
 
Sau hành động này, utterance sẽ được đưa vào hàng đợi huấn luyện của Wit.ai. Việc huấn luyện có thể mất một ít thời gian, vì vậy ta có thể xem qua các mục quản lý các thành phần chính trong Wit.ai, bắt đầu từ mục quản lý intent, cho phép ta thêm mới intent, sửa intent đang có hoặc xóa intent đó đi

![Alt text](https://i.ibb.co/47jN9yr/image.png "Màn hình quản lý Intent")
 
Tương tự với mục quản lý entity, cho phép nhà phát triển thêm entity mới, chỉnh sửa entity có sẵn (Thêm từ mới, alias mới, …), xóa entity đó đi

![Alt text](https://i.ibb.co/R4CMQ7v/image.png "Màn hình quản lý Entity")
 
Tương tự với mục quản lý trait, cho phép nhà phát triển thêm trait mới, chỉnh sửa trait có sẵn (Thêm giá trị mới, alias mới, …), xóa trait đó đi

![Alt text](https://i.ibb.co/rxMR5jD/image.png "Màn hình quản lý Trait")
 
Còn lại là mục quản lý utterance, đây là nơi mà ta chỉnh sửa các utterance đã có và có khả năng train và validate lại các utterance này sau khi sửa đổi chúng

![Alt text](https://i.ibb.co/TtQj5mr/image.png "Màn hình quản lý Utterance")
 
Phần setting cung cấp cho ta một số cài đặt về mặt kết nối, ngôn ngữ, cũng như cung cấp lệnh mẫu để ta thử kết nối đến chatbot ta vừa tạo

![Alt text](https://i.ibb.co/RhPkm6p/image.png "Màn hình Setting cung cấp phương thức kết nối đến ứng dụng")

Lấy đường link ở phần HTTP API, ta bổ sung tham số q bằng câu đầu vào của ta cùng với đó thêm Token Bearer vào phần Authorization. Ta sử dụng Postman để minh họa với mục đích dễ phân tích cú pháp gọi API của Wit.ai

![Alt text](https://i.ibb.co/wcwLsbP/image.png )
![Alt text](https://i.ibb.co/S3PzKx9/image.png "Mẫu yêu cầu API thông qua Postman")
 
Kết quả sau khi gửi yêu cầu GET với tham số trên là như dưới đây. Ta có thể thấy được chatbot đã nhận diện được câu đầu vào của chúng ta

```json
{
    "text": "Thoi tiet o Ha Noi the nao",
    "intents": [
        {
            "id": "615726486015757",
            "name": "get_weather",
            "confidence": 1
        }
    ],
    "entities": {
        "wit$location:location": [
            {
                "id": "216476799904883",
                "name": "wit$location",
                "role": "location",
                "start": 12,
                "end": 18,
                "body": "Ha Noi",
                "confidence": 0.9356,
                "entities": [],
                "suggested": true,
                "value": "Ha Noi",
                "type": "value"
            }
        ]
    },
    "traits": {
        "no_detail": [
            {
                "id": "455640929071006",
                "value": "true",
                "confidence": 1
            }
        ]
    }
}
```

Một số tính năng bổ sung bao gồm việc ta có thể kiểm tra lưu lượng gọi đến ứng dụng của ta thông qua mục insight, được phân loại theo số intent, số entity và số trait được trả về, phù hợp với việc phân tích hành vi của khách hàng

![Alt text](https://i.ibb.co/g716CTW/image.png "Màn hình thống kê lưu lượng sử dụng API")
 
Ngoài ra Wit.ai còn cung cấp chức năng phân tích live utterance, nghĩa là các utterance được người dùng nhập, nhà phát triển có thể xem kết quả phân tích utterance của Chatbot, sửa chữa và đem kết quả đã sửa đó để Train and Validate lại cho Chatbot, nâng cao độ chính xác của Chatbot

![Alt text](https://i.ibb.co/hVMDJT8/image.png "Ví dụ về Live Utterance")
 
Như vậy với bộ công cụ mãnh mẽ của Wit.ai và với đủ dữ liệu huấn luyện, ta có thể lập trình hệ thống chatbot có thể hiểu được ngôn ngữ tự nhiên một cách thuyết phục
Với toàn bộ kiến thức đã tìm hiểu được. Cảm ơn các bạn đã đọc bài viết này và chúc bạn một ngày mới tốt lành :-)
