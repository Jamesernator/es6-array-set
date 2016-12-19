#!/usr/bin/env babel-node
function id(x) {
    return x
}

export default class ArraySet {
    constructor(iterable=null, serialize=id) {
        /*  Creates an ArrayMap object with optional serialize that will
            be called on every single key entered
        */
        this.size = 0
        this._subSets = new Map()
        this._hasItem = false
        this._serialize = serialize
        if (iterable != null) {
            for (const value of iterable) {
                this.add(value)
            }
        }
    }


    add(array) {
        /* Adds an array to the ArraySet */
        this._add(this._serialize(array))
        return this
    }
    /* eslint-disable complexity */
    _add(array) {
        /* This actually adds the array to the ArraySet, returns true
            if the */
        if (array.length === 0) {
            if (this._hasItem) {
                return false
            } else {
                this.size += 1
                this._hasItem = true
                return true
            }
        } else {
            const [first, ...rest] = array
            if (!this._subSets.has(first)) {
                this._subSets.set(first, new ArraySet())
            }
            const subSet = this._subSets.get(first)
            const changed = subSet._add(rest)
            if (changed) {
                this.size += 1
            }
            return changed
        }
    }
    /* eslint-enable complexity */

    clear() {
        /* Removes all elements from the ArraySet */
        this.size = 0
        this._subSets = new Map()
        this._hasItem = false
    }

    delete(array) {
        /* This removes an item from the ArraySet */
        return this._delete(this._serialize(array))
    }

    /* eslint-disable complexity */
    _delete(array) {
        const [first, ...rest] = array
        if (array.length === 0) {
            if (this._hasItem) {
                this.size -= 1
                this._hasItem = false
                return true
            } else {
                return false
            }
        } else if (!this._subSets.has(first)) {
            return false
        } else {
            const subSet = this._subSets.get(first)
            const deleted = subSet._delete(rest)
            if (deleted) {
                this.size -= 1
                if (subSet.size === 0) {
                    this._subSets.delete(first)
                }
            }
            return deleted
        }
    }
    /* eslint-enable complexity */

    *entries() {
        for (const value of this.values()) {
            yield [value, value]
        }
    }

    forEach(callback, thisArg=null) {
        /* Invokes the callback with each element of the set */
        for (const value of this.values()) {
            Reflect.apply(callback, thisArg, [value, value, this])
        }
    }

    has(array) {
        return this._has(this._serialize(array))
    }

    _has(array) {
        const [first, ...rest] = array
        if (array.length === 0) {
            return this._hasItem
        } else if (!this._subSets.has(first)) {
            return false
        } else {
            return this._subSets.get(first).has(rest)
        }
    }

    *keys() {
        yield* this.values()
    }

    *values() {
        if (this._hasItem) {
            yield []
        }
        for (const [value, subSet] of this._subSets) {
            for (const arr of subSet.values()) {
                yield [value, ...arr]
            }
        }
    }

    *[Symbol.iterator]() {
        yield* this.values()
    }
}
