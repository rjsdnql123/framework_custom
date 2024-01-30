export default class Component {
    $target;
    props;
    state;
    $components = {};
  
    constructor($target, props) {
      this.$target = $target;
      this.props = props;
      // this.$components = new Proxy({}, {
      //   set(target, prop, value, receiver){
      //       return true;
      //     }
      // });
      this.setup();
      this.setEvent();
      this.render();
      // this.renderChildComponent();
    }
    setup() {}
    template() {
      return "";
    }
    render() {
      const asdfadsf = this.createElementFromHTML(this.template());
      this.renderTets(asdfadsf, this.$target);
      this.renderChildComponent(asdfadsf);
  
      this.mounted();
    }
  
    rerender( ) {
      const asdfadsf = this.createElementFromHTML(this.template());

      // 임시 로직 돔을 초기화 해주면서 다시 그려준다.
      this.$target.innerHTML = ''
      this.renderTets(asdfadsf, this.$target);
      this.mounted();
    }

    mounted() {
      // this.$components.test = 5
    }
  
    // private
    renderChildComponent(elements) {
      if (this.$components) {
        Object.keys(this.$components).forEach((key) => {
          const findComponent = elements.children.find(
            (element) => element.type === key
          );
  
          const $selector = document.querySelector(`${key}`);
          // const props = this.createElementFromHTML(this.template());
  
          new this.$components[key]($selector, {
            ...this.utilsPropsPick(findComponent.props)
          });
        });
      }
    }
  
    utilsPropsPick(findComponentProps) {
      let temp = {};
      Object.keys(findComponentProps).forEach((key) => {
        const func = this[findComponentProps[key]];
        if (typeof func === "function") {
          // 함수
          temp[key] = func.bind(this);
        } else {
          temp[key] = func;
        }
      });
      return temp;
    }
  
    setEvent() {}
    setState(newState) {
      this.state = { ...this.state, ...newState };
      this.rerender()
    }
    addEvent(eventType, selector, callback) {
      const children = [...this.$target.querySelectorAll(selector)];
      this.$target.addEventListener(eventType, (event) => {
        if (!event.target.closest(selector)) return false;
        callback(event);
      });
    }
  
    // createElement 함수는 앞서 구현한 것을 사용합니다.
    createElement(type, props, ...children) {
      return {
        type,
        props: props || {},
        children: children.length ? children : null
      };
    }
  
    createElementFromHTML(html) {
      let enter = html.replace(/\n/g, "");
  
      const parser = new DOMParser();
      const doc = parser.parseFromString(enter, "text/html");
  
      function traverse(element) {
        const type = element.tagName.toLowerCase();
        const props = {};
        const children = [];
  
        for (const { name, value } of element.attributes) {
          const result = name.replace(/-([a-z])/g, (_, match) =>
            match.toUpperCase()
          );
          props[result] = value;
        }
  
        for (const childNode of element.childNodes) {
          if (childNode.nodeType === Node.TEXT_NODE) {
            children.push(childNode.textContent.trim());
          } else if (childNode.nodeType === Node.ELEMENT_NODE) {
            children.push(traverse.call(this, childNode));
          }
        }
        return this.createElement(type, props, ...children);
      }
      return traverse.call(this, doc.body.firstChild);
    }
  

    renderTets(element, container) {
      // 문자열 이면 바로 화면에 뿌려줌
      if (typeof element.children === "string") {
        const createCurrentElement = document.createElement(element.type);
  
        const childStr = document.createTextNode(element.children);
        createCurrentElement.appendChild(childStr);
        container.appendChild(createCurrentElement);
        return;
      }
  
      const { type, props, children } = element;
      // element 추가 로직
      const el = document.createElement(type);
  
      for (let key in props) {
        if (key.startsWith("on")) {
          if (this.$target) {
          }
          // onClick="methode"
          // onClick="this.props.methode"
  
          const convertPropsStr = props[key].replace(
            /this\.props\['(.*?)'\]/,
            "$1"
          );
          // debugger
          const componentFunction = this[props[key]] || this.props[convertPropsStr]
          console.log(el, 'elelel', this, 'thisthis')
          el.addEventListener(
            key.substring(2).toLowerCase(),
            componentFunction.bind(this)
          );
        } else if (
          key === "classname" ||
          key === "id" ||
          key === "type" ||
          key === "placeholder"
        ) {
          el.setAttribute(key, props[key]);
        } else if (key) {
          // props 를 어떻게 처리할까 고민되네
          el.setAttribute(key, props[key]);
        }
      }
  
      if (children) {
        children.forEach((child) => {
          if (typeof child === "string") {
            el.appendChild(document.createTextNode(child));
          } else if (Object.keys(this.$components).length) {
            if (Object.keys(this.$components).includes(child.type)) {
              // Component 생성을 위한 태그
              // debugger
              const el = document.createElement(child.type);
  
              container.appendChild(el);
            }
          } else {
            // component 는 여기서 뿌려주는게 아니야
            this.renderTets(child, el);
          }
        });
      }
      // debugger
      container.appendChild(el);
    }
  }
  