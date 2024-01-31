import InputCompontnt from "../component/inputComponent.js";
import Component from "../core/core.js";

export default class App extends Component {
  setup() {
    this.$components = {
      'input-component': InputCompontnt
    };

      this.useState({
        count: 0,
        name: '입력 해주세요'
      })
  }

  plus() {
    console.log(this.state, 'plus ststa')
    // this.setState({
      // count: 
      this.state.count += 1
    // });
  }

  minus() {
    // this.setState({
      // count: 
      this.state.count -= 1
    // });
  }

  handleInputChange(event) {
    // this.setState({
      // name: 
      this.state.name = event.target.value
    // })
  }

  jsxRender() {
    console.log(this.state, 'ststaststaststaststaststaststaststaststaststa')
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
        <button onClick="minus"> - </button>
        <input-component handle-input-change="this.handleInputChange" name="this.state.name"></input-component>
      </div>
        `;
  }
}
