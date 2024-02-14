let isRenderPhase = false;

export default class NComponent {
  $target;
  props;
  state = {};
  $components = {};
  #isComponentdidMount = false;

  constructor($target, props) {
    this.$target = $target;
    // props는 자신 마음대로 변경 되어서는 안된다.

    const prop = props || {};

    this.props = new Proxy(prop, {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
      set() {
        throw new TypeError("props는 변경이 불가능 합니다.");
      }
    });

    this.init();

    const rootThis = this;

    this.state = new Proxy(this.state, {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value, receiver) {
        isRenderPhase = true;
        if (Reflect.set(target, prop, value, receiver)) {
          // component did mount(첫 렌더링) 전에 #_rerender를 할 필요가 없음
          // 성능을 고려 해 한번만 렌더링 되면 됨
          // if (rootThis.#isComponentdidMount) {
          //   // 스케쥴 등록
          //   schedulerHook(value);
          //   if(isRenderPhase) {
          //     // 안돼
          //     console.log('laksdjflkasjflkjsadkflajsklfjasklf')
          //     return false;
          //   }
          //   console.log(isRenderPhase, 'isRenderPhase')
          //   return true
          // console.log()
          // rootThis.setState()
          // rootThis.#_rerender();
          // }
          return true;
        }
        // error
        return false;
      }
    });
    this.#render();
    this.componentDidMount()
  }

  init() {}

  jsxRender() {
    return "";
  }

  #render() {
    const element = this.#_createElementFromHTML(this.jsxRender());
    this.#_renderElement(element, this.$target);
    this.#_renderChildComponent(element);
    
    this.#_mounted();
  }

  #_rerender() {
    this.$target.innerHTML = "";
    this.#render();
  }

  #_mounted() {
    this.#isComponentdidMount = true;
  }

  // React와 같은 componentdidMount
  componentDidMount() {}

  // private
  #_renderChildComponent(elements) {
    if (this.$components) {
      Object.keys(this.$components).forEach((key) => {
        const findComponent = elements.children.find(
          (element) => element.type === key
        );

        const $selector = document.querySelector(`${key}`);
        new this.$components[key]($selector, {
          ...this.#_utilsPropsPick(findComponent.props)
        });
      });
    }
  }

  #_utilsPropsPick(findComponentProps) {
    let temp = {};

    Object.keys(findComponentProps).forEach((key) => {
      const convertPropsStr = findComponentProps[key].replace(/this\./, "");
      const getProperty = new Function("obj", `return obj.${convertPropsStr};`);

      const value = getProperty(this);

      const func = value;
      if (typeof func === "function") {
        // 함수
        temp[key] = func.bind(this);
      } else {
        temp[key] = func;
      }
    });
    return temp;
  }

  /**
   * 
   * React, Qwik의 상태 관리 방법을 보며 벤치마킹.
   * 첫 State 할당은 useState를 통해 해주어야 함.
   * 그렇지 않으면 데이터가 입력되지 않음
   */
  
  /**
   * this.state = {}
   * this.setState({
   * ...{}, a : b
   * }) 
   */
    
  useState(newState) {
      Reflect.set(this, "state", newState);
  }

  #_convertHtmltoJsx(type, props, ...children) {
    return {
      type,
      props: props || {},
      children: children.length ? children : null
    };
  }

  #_createElementFromHTML(html) {
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
          children.push(childNode.textContent
          // .trim()
          );
        } else if (childNode.nodeType === Node.ELEMENT_NODE) {
          children.push(traverse.call(this, childNode));
        }
      }
      return this.#_convertHtmltoJsx(type, props, ...children);
    }
    return traverse.call(this, doc.body.firstChild);
  }
  // batch 업데이트를 위한 값
  batch = false
  bachUpdate(callback) {
    this.batch = true
    callback()
    this.batch = false
    this.#_rerender();
    // 상태 변화에 따른 렌더링은 여기서 시켜주기
  }

  // setState를 통해 상태를 업데이트 해줌
  setState() {

    // 이벤트 액션 작동 중 setState가 있으면? 
    // batch 가 true, false를 판단한다.

    // batch 가 true면 추 후에 업데이트 시켜 줄 것이기 때문에
    // pending state에 담아 잠시 보관

    // batch 가 false면 완료 된것 으로 판단 하고 바로 업데이트 시켜준다.


  }

  #_renderElement(element, container) {
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

        const convertPropsStr = props[key].replace(/this\./, "");

        const getProperty = new Function(
          "obj",
          `return obj.${convertPropsStr};`
        );

        const value = getProperty(this);

        // onClick -> click
        let eventType = key.substring(2).toLowerCase();

        // input onchange 는 별도로 처리해서 실시간 반영 되도록 처리 하고 싶음
        // 화면이 다시 그려질 때를 대비하지 못함
        // if(type === 'input') {
        //   // input type 이면
        //   eventType = 'input'
        // }
          // console.log(value, 'value')
        const componentFunction = value;

        el.addEventListener(eventType, (event) => {
          this.bachUpdate(componentFunction.bind(this, event))
        });
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
            const createComponentElement = document.createElement(child.type);

            el.appendChild(createComponentElement);
          } else {
            this.#_renderElement(child, el);
          }
        } else {
          // component 는 여기서 뿌려주는게 아니야
          this.#_renderElement(child, el);
        }
      });
    }
    container.appendChild(el);
  }
}


let scheduler = [];

function schedulerHook(value) {
  console.log(isRenderPhase, 'isRenderPhaseisRenderPhaseisRenderPhase')
  scheduler.push(value)
    // 여기서 스케쥴 등록

    // 등록 했다 치기

    //스케쥴 등록 끝

    if(scheduler.length) {
      // 1이상이면
      // render
      
    }
    isRenderPhase = false;
}