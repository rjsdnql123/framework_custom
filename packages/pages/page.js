import Component from "../core/core.js";

export default class App extends Component {
  setup() {
    this.$components = {};

    this.state = {
      count: 0,
      name: '입력 해주세요'
    };
  }

  plus() {
    console.log('ss')
    this.setState({
      count: this.state.count + 1
    });
  }

  template() {
    console.log(this.state, 'safasfdasfdasfadsfdasf')
    return `
      <div>
        <div>
        <span>이름 - </span>
        <span>${this.state.name}</span>
        </div>
        <div>
          count -> ${this.state.count}
        </div>
        <button onClick="plus"> + </button>
        <button> - </button>
      </div>
        `;
  }
}
