import Component from "../core/core";

export default class InputCompontnt extends Component {
  setup() {
    this.useState({
      hi: 0
    })
  }

  componentDidMount() {
    console.log('componentDidMount')
  }

  handlebutton() {
    this.state.hi += 2
  }

  jsxRender() {
    console.log('childrend')
    return `
        <div>
        <label>
            id 입력 해주세요 11- <input onChange="this.props.handleInputChange" type="text" value="${this.props.name}"></input>
        </label>
        <div>${this.state.hi}</div>
        <button onClick="this.handlebutton">+</button>
        </div>
        `;
  }
}
