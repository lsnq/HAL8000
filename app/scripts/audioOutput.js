class AudioOutput {
    constructor() {
        this.msg = new SpeechSynthesisUtterance();
        this.msg.pitch = 0.5;

        this.getVoice();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = this.getVoice.bind(this);
        }
    }

    getVoice() {
        const voices = window.speechSynthesis.getVoices();
        this.msg.voice = voices.find((el) => {
            return (el.lang === 'en-US');
        });
    }

    getText() {
        const phrases = [
            'Motion detected! Unrecognized liveform!',
            'Violation! Exterminate! Exterminate!',
            'Who`s there? Anyone alive?'
        ];

        const randomInt = Math.floor(Math.random() * phrases.length);
        this.msg.text = phrases[randomInt];
    }

    render() {
        this.getText();
        window.speechSynthesis.speak(this.msg);
    }
}

export default AudioOutput;
