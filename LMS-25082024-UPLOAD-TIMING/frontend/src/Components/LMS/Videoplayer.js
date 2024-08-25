/*import React, { Component } from 'react';


class LearningMaterial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    };
  }

  handleFileChange = (event) => {
    // Get the selected file from the input element
    const file = event.target.files[0];
    this.setState({ selectedFile: file });
  };

  handleUpload = () => {
    // Perform file upload logic here, e.g., using fetch API or axios
    const { selectedFile } = this.state;
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Example: Upload the file using fetch API
      fetch('/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (response.ok) {
          console.log('File uploaded successfully');
          // Reset selected file state if needed
          this.setState({ selectedFile: null });
        } else {
          console.error('Failed to upload file');
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
    } else {
      console.warn('No file selected');
    }
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFileChange} />
        <button onClick={this.handleUpload}>Upload</button>
      </div>
    );
  }
}

export default LearningMaterial;
*/ 
import React, { Component } from 'react';
import ReactPlayer from 'react-player';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.url || '', // Initialize with the provided URL
      playing: false,
      volume: 0.5,
      muted: false,
      loop: false,
      controls: true, // Enable controls to interact with the video
    };
  }

  handleInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      this.setState({ url });
    }
  };

  render() {
    const { url, playing, volume, muted, loop, controls } = this.state;

    return (
      <div className="custom-video-player">
        <input type="file" accept="video/mp4,video/x-m4v,video/*,audio/mp3,audio/*,video/webm,video/ogg" onChange={this.handleInputChange} />

        <div className="player-wrapper">
          <ReactPlayer
            className="react-player"
            url={url}
            playing={playing}
            volume={volume}
            muted={muted}
            loop={loop}
            controls={controls}
            width="200px"
            height="200px"
          />
        </div>
      </div>
    );
  }
}

export default VideoPlayer;
