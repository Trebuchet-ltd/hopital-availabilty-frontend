import React, {PureComponent} from "react";

interface RTCVideoProps {
    mediaStream: MediaStream |void| null
}

class RTCVideo extends PureComponent <RTCVideoProps>
{
    constructor(props: RTCVideoProps)
    {
        super(props);
    }

    addMediaStream = (video: HTMLVideoElement) =>
    {
        const {mediaStream} = this.props;
        // Prevents throwing error upon a setState change when mediaStream is null
        // upon initial render
        if (mediaStream) video.srcObject = mediaStream;
    };

    render()
    {
        const {mediaStream} = this.props;
        console.log("mediaStream: ", mediaStream);

        return (
            <video
                className="rtc__video"
                style={{width: "480px", backgroundColor: "black"}}
                autoPlay
                ref={mediaStream ? this.addMediaStream : null}
            >
                <track default kind="captions"/>
            </video>
        );
    }
}

export default RTCVideo;