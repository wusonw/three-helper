# three-helper

### description

three-helper to use three easier


### how to use
#### 1. Install it from npm
```bash
npm i three-helper
```
#### 2. Import and use it
```js
// import it
import { ThreeHelper } from 'three-helper'

// new instance
const helper = new ThreeHelper()

// init it with width and height
const domElement = helper.init(width,height)

// get partent node and append to it
const parent = doucment.getElementById('parent')
parent.appendChild(domElement)
```
