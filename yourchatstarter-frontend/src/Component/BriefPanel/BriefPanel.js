import './Style.css'
const { Component } = require("react");

class BriefPanel extends Component {
   
    render() {
        const bpService = (
            <div className='brief-panel-container'>
                <h3>Dịch vụ của chúng tôi</h3>
                <p>YourChatStarter cung cấp cho bạn một chatbot cung cấp thông tin nhanh và chính xác</p>
                <p>Sử dụng với một giao diện khung chat đơn giản và thân thiện</p>
            </div>
        )

        const bpPricing = (
            <div className='brief-panel-container'>
                <h3>Giá cả dịch vụ</h3>
                <p>Bạn có thể sử dụng dịch vụ của chúng tôi miễn phí với một số giới hạn</p>
                <p>Tuy vậy với một khoảng phí nhỏ chúng tôi sẽ đảm bảo trải nghiệm của bạn sẽ được nâng cao</p>
            </div>
        )

        const bpAbout = (
            <div className='brief-panel-container'>
                <h3>Về chúng tôi</h3>
                <p>Những con người đằng sau dịch vụ</p>
                <p>Chúng tôi là một đội ngũ mà bạn có thể tin tưởng</p>
            </div>
        )

        const bpProcess = (
            <div className='brief-panel-container'>
                <h3>Quy trình đóng phí</h3>
                <p>Làm việc với đối tác, chúng tôi cung cấp cho bạn một quy trình giao dịch tiện lợi</p>
                <p>cũng như hỗ trợ nhiều phương thức thanh toán</p>
            </div>
        )

        const bpResponse = (
            <div className='brief-panel-container'>
                <h3>Họ nghĩ gì về chúng tôi?</h3>
                <p>Từ trải nghiệm thực tế của người sử dụng</p>
            </div>
        )

        const bpBlog = (
            <div className='brief-panel-container'>
                <h3>Muốn biết thêm?</h3>
                <p>Đón đọc những bài viết của chúng tôi về hệ thống đằng sau dịch vụ này</p>
                <p> cũng như một số mẹo khi sử dụng dịch vụ của chúng tôi</p>
            </div>
        )

        const bpContact = (
            <div className='brief-panel-container'>
                <h3>Liên lạc với chúng tôi</h3>
                <p>Bạn vẫn còn thắc mắc? Có nhu cầu hợp tác với chúng tôi</p>
                <p>Tham khảo những kênh liên lạc dưới đây</p>
            </div>
        )
        
        if (this.props.mode === "service") {
            return [bpService]
        }
        if (this.props.mode === "pricing") {
            return [bpPricing]
        }
        if (this.props.mode === "about") {
            return [bpAbout]
        }
        if (this.props.mode === "process") {
            return [bpProcess]
        }
        if (this.props.mode === "response") {
            return [bpResponse]
        }
        if (this.props.mode === "blog") {
            return [bpBlog]
        }
        if (this.props.mode === "contact") {
            return [bpContact]
        }
        return [bpService]
    }
}

export default BriefPanel