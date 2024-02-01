## 사용 스택
webpack, javascript, html

## 실행 방법
```
npm install
npm run dev
```

## 왜 하게 되었나?
프레임 워크는 과연 어떻게 만들어지고 동작할까? 라는 생각에서 만들어본 작은 나의 프레임워크 (나작프)

only javascript만을 사용 해 만들어 보고 싶어, jsx를 구현하지 않고

문자열로 html을 받아 화면에 뿌려질 수 있도록 구현 되어 있습니다.

class를 사용하여, 상속을 통해 methode를 사용 할 수 있도록 하고, 내부 동작은 es2017 private(#)을 사용하여 유저가 건들이지 말아야 할 부분을 분리해 관리 하고 있습니다.

React와 qwik 등 여러 유명한 라이브러리에서 감명을 받아 여러가지를 짬뽕 해놓은 형태로 주로 React를 따라가고 있습니다.

기본적인 기능은 React와 같이, 상태를 관리, 사용 할 수 있고 (useState)

이벤트를 직접 걸어주지 않아도 onClick을 통해 event를 걸어줄 수 있습니다.

## 사용 법

setup은 render되기 전에 useLayoutEffect | shouldcomponentupdate 처럼 사전 작업을 하는 공간 입니다.

componentDidMount 는 React와 같이 rendering이 완료 된 후에 작동 하는 함수 입니다. 

state의 선언은 다음과 같이 선언하고

```js
this.setState({
  testText: 'TEST';
})
```

다음과 같이 mutable 하게 사용 할 수 있도록 구현 하였습니다. (qwik의 상태 관리 방법)

```js
this.state.testTEXT = 'TEST COMPLETE';
```

Proxy를 사용 하여 this.state 가 SET이 될 때마다 상태 변경을 감지하고, rerender 해주는 방식을 채택 했습니다.

## 현 상황
DOM을 webAPI를 사용 해 HTML을 파싱해 사용하고 있으므로 여러가지 제약들이 생기고 있음.
이 문제를 해결하려면 jsx를 사용 하거나 직접 HTML을 파싱 하거나 선택 해야 함.
html을 String으로 작성 하면서 상태, 변수, 함수 등이 사용 되었는지 알아보기 힘듦. (그냥 babel 써서 jsx로 만들까...)


## 다음 도전 과제

- 함수로 리팩터링
- typescript로 리팩터링
- zustand와 같은 상태 관리 라이브러리 추가
- babel을 사용 해 jsx문법을 사용 할 수 있도록 수정 (일부러 안하고 있음) 사용하면 dom을 그려주는게 더 편할듯..
- rendering 최적화
    = 지금은 rerender가 발생하면 화면을 다시 그려주는 방식을 채택 하고 있음. 브라우저에 리페인팅, 리플로우가 굉장이 많이 발생 하고 있음.
    = 브라우저가 너무 많은 일을 하고 있으므로 이건 jsx를 추가하며 수정 할 수 있지 않을까?
    = jsx를 도입하면서 React의 virtual dom을 같이 써보자


... 추가 중..


.. 두서 없는 고민..
프레임워크들으 각 상태를 immutable || mutalble 하게 관리하고 있다.

현 프로젝트에서 mutable한 상태를 관리 하게 된 이유는 불필요한 메모리를 소비 하지 않기 위해 mutable한 상태를 관리하고 좀더 직관적인 상태 변화를 보고 싶어서 였으나,

개발 하면서 느낀점은 ```state``` 하나가 변하면 모든 화면은 다시 그려지고 있음.

jsx를 사용한들 이 문제점은 해결 되지 않음

다시 immutable한 상태를 관리 하기 위해 React의 내부 구현을 참고 함

1. useState 사용 시

```ts
// https://github.com/facebook/react/blob/d29f7d973da616a02d6240ea10306a6f33e35ca1/packages/react/src/ReactHooks.js#L23
export function useState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
```


dispatcher.useState

```ts
// https://github.com/facebook/react/blob/d29f7d973da616a02d6240ea10306a6f33e35ca1/packages/react-reconciler/src/ReactFiberHooks.js#L1767-L1779
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {

  * const hook = mountStateImpl(initialState);  // React fiber 의 scheduling 관련 로직들이 담겨 있음
  const queue = hook.queue;
  const dispatch: Dispatch<BasicStateAction<S>> = (dispatchSetState.bind(  // 외부로 노출되는 함수로 bind로 각 함수들이 묶여 있음
    null,
    currentlyRenderingFiber,
    queue,
  ): any);
  queue.dispatch = dispatch;
  return [hook.memoizedState, dispatch];   // 우리가 만나게 되는 const [state, setState] = useState
}
```


```* hook```을 따라가게 되면 만나는 함수

참고 해야 할 부분
- workInProgressHook는 전역 변수로 스케쥴링을 담당하고 있음.
- linked list 형태로 현 queue가 null 이라면 ```currentlyRenderingFiber.memoizedState = workInProgressHook = hook;``` workInProgressHook를 header로 잡고
- ```workInProgressHook = workInProgressHook.next = hook``` next로 이어서 사용한다.
- 화면을 그려주는 부분까지 보진 못했지만, linked list로 상태를 순차적으로 업데이트 하고 화면에는 한번에 반영하는 방법으로 수정 하여야 겠다

```ts
// mountStateImpl-  https://github.com/facebook/react/blob/d29f7d973da616a02d6240ea10306a6f33e35ca1/packages/react-reconciler/src/ReactFiberHooks.js#L1749C1-L1765C2
// mountWorkInProgressHook - https://github.com/facebook/react/blob/d29f7d973da616a02d6240ea10306a6f33e35ca1/packages/react-reconciler/src/ReactFiberHooks.js#L927-L946

function mountStateImpl<S>(initialState: (() => S) | S): Hook {
  * const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    // $FlowFixMe[incompatible-use]: Flow doesn't like mixed types
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue: UpdateQueue<S, BasicStateAction<S>> = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  };
  hook.queue = queue;
  return hook;
}


function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,

    baseState: null,
    baseQueue: null,
    queue: null,

    next: null,
  };

  if (workInProgressHook === null) {
    // This is the first hook in the list
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}

```
