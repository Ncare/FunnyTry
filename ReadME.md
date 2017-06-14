
看到一些有趣的东西，然TRY

```javascript
Object.assign()
Object.is() 严格相等

Array.from({length: 5}, () => `aaa`)
Array.includes()


Array = [
  ['a', 'a', 'a'],
  ['b', 'b', 'b'],
  ['c', 'c', 'c']
]
* Array.map((i) => {})  // i => ['a', 'a', 'a'] ['b', 'b', 'b'] ['c', 'c', 'c']
* Array.forEach((i, j) => {}) // i => ['a', 'a', 'a'] ['b', 'b', 'b'] ['c', 'c', 'c'] j => 0, 1, 2
* Array.some // 返回boolean, 判断是否有元素符合条件
```

box-sizing: border-box || content-box  
含有内边距的盒子  ||  内容边框盒子(默认)