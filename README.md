# ArraySet

## Description

ArraySet is a ES6 Set-like object designed for use where arrays are needed to be used instead of just values by Same-Value-Equality

```javascript
import ArraySet from "es6-array-set"
set = new ArraySet();
set.add([1,2,3]);
set.has([1,2,3]); // true
```

## Install
```npm install es6-array-set```

## Documentation
ArraySet has an identical set of available methods as EcmaScript 2016 Sets provide, the only major differences are the value equality and order of iteration.

### Value Equality
The main difference from ES6 sets is that values are equal if the values of the arrays are equal.
For example with values ``a=[1,2,3];`` and ``b=[1,2,3];`` then these are considered equal. Sub-arrays and objects in the array however are not considered by values so ``a=[1,2,{}];`` and ``b=[1,2,{}]`` are not equal as each ```{}``` has a different identity.

### Order of Iteration
Due to how the ArraySet is stored (as a tree of values) we don't iterate over the values in insertion order, instead they're iterated using tree-search.

### Properties

#### ArraySet.length
For sake of consistency with ES6 Sets ArraySet.length has length 0.

#### ArraySet.prototype
Its the prototype for ArraySet objects, feel free to extend it.

### Methods

#### new ArraySet(iterable, serialize)
When creating an ArraySet you can pass in an iterable argument just like
ES6 Set however you can also pass in an additional argument: serialize, this
argument must be a function and will be called on every array passed to any
of the methods, this function must return an Array (or array-like)

```javascript
function toSet(iterable) {
    return Array.from(iterable).sort()
}

let set = new ArraySet(null, toSet)
set.add([1,2,3,3])
set.has([1,2,3]) // true
set.has([1,2,2,2,2,3,3,3,3]) // true
```


#### ArraySet.prototype.add(array)
Adds a value to the set.

```javascript
let set = new ArraySet()
set.add([1,2,3])
set.has([1,2,3]) // true
set.has([1,2,3,4]) // false
```

#### ArraySet.prototype.clear()
Removes all values from the ArraySet object.
```javascript
let set = new ArraySet()
set.add([1,2])
set.add([3,4])
set.size // 2
set.clear()
set.size // 0
```


#### ArraySet.prototype.delete(array)
Removes an array. ArraySet.prototype.has(array) will return false afterwards.
```javascript
let set = new ArraySet();
set.add([1,2,3])
set.has([1,2,3]) // true
set.delete([1,2,3])
set.has([1,2,3]) // false
```

#### ArraySet.prototype.entries()
Returns a new Iterator that yields all arrays in the ArraySet as [value, value] pairs. Unlike ES6 Sets this is not in insertion order but rather using depth-first-search (yielding as they're seen).

```javascript
let set = new ArraySet();
set.add([1,2,3])
set.add([1,2,4])
set.add([1,2])

Array.from(set) /* [
    [[1,2], [1,2]],
    [[1,2,3], [1,2,3]],
    [[1,2,4], [1,2,4]]
] !NOTE: Order not guaranteed

*/
```

#### ArraySet.prototype.forEach(callback[, thisArg])
Calls callback once for each array present in the Set object, in insertion order. If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.
```javascript
let set = new ArraySet();
set.add([1,2,3])
set.add([3,4,5])

let total = 0
set.forEach(function(array, arraySet) {
    for (const item of array) {
        total += item
    }
})
total // 21
```


#### ArraySet.prototype.has(array)
Returns true if the array is in the set, false otherwise.
```javascript
let set = new ArraySet()
set.add([1,2,3])
set.has([1,2,3]) // true
set.has([1,2]) // false

set.has([]) // false

set.add([])
set.has([]) // true
```

#### ArraySet.prototype.keys()
Same as `ArraySet.prototype.values()`


#### ArraySet.prototype.values()
Returns an Iterator of values of the set (shorter arrays are always yielded first), no order is guaranteed when arrays have equal prefixes (e.g. [1,2], [1,3] could be in any order)
```javascript
let set = new ArraySet();
set.add([1,2,3])
set.add([1,2])
set.add([])
set.add([1,2,4])

Array.from(set.keys()) // [[], [1,2], [1,2,3], [1,2,4] !NOTE: Order not guaranteed
```

#### ArraySet.prototype\[Symbol.iterator\]()
Same as `ArraySet.protototype.values()`


### Credits
Documentation based off Mozilla Developer Network's Set documentation <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set>

Original idea based on <http://stackoverflow.com/questions/21838436/map-using-tuples-or-objects> which led to the creation of [https://github.com/Jamesernator/es6-array-map](ArrayMap).
