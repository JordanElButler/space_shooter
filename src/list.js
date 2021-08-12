/**
 *  janky implementation requires that data not be null
 */
class FiniteList {
	constructor(size) {
		this._size = size;
		this.data = [];
		this.index = 0;
	}
	append(el) {
		this.data[this.index] = el;
		this.index = (this.index + 1) % this._size;
	}
	map(cb) {
		for (var i = 0; i < this._size; i++) {
			if (this.data[i]) {
				cb(this.data[i]);
			}
		}
	}
	clear() {
		this.data = [];
		this.index = 0;
	}
}
function List() {

	this.head = {
		data: null,
		prev: null,
		next: null
	};

	// just make it head
	this.append = function(data) {
		var node = this.makeNode(data);
		node.prev = null;
		node.next = this.head;
		this.head.prev = node;
		this.head = node;
	};

	this.nodeAppend = function(node) {
		node.prev = null;
		node.next = this.head;
		this.head.prev = node;
		this.head = node;
	}

	this.remove = function(node) {
		// case node is head
		if(node === this.head) {
			// head is non-empty
			if(node.data !== null) {
				this.head = node.next;
			}
		}
		// case node is at the end
		else if(node.next.data === null) {
			// case where node.prev is null is handled above
			var prev = node.prev;
			prev.next = node.next;
		}
		// case neither node or node.prev or node.next is null and node is not head
		else {
			var prev = node.prev;
			var next = node.next;

			prev.next = next;
			next.prev = prev;

			node.prev = null;
			node.next = null;
		}

		node = null;
	};

	this.clear = function() {
		this.head = this.makeNode(null);
	}

	this.start = function() {
		if(this.head.data === null) return null;
		return this.head;
	}

	this.next = function(node) {
		return node.next;
	};

	// only use after this.start()!
	this.hasNext = function(node) {
		if(node === null) return false;
		if(node.next === null) return false;
		else return node.next.data !== null;
	};

	this.isEmpty = function() {
		return this.head.data === null;
	};

	this.getValue = function(node) {
		return node.data;
	};

	this.makeNode = function(data) {
		return {
			data: data,
			prev: null,
			next: null
		};
	};


	this.printList = function() {
		console.log("printing list...");
		if(!this.isEmpty()) {
			var node = this.start();
			while(true) {
				console.log(node);
				if(!this.hasNext(node)) {
					break;
				}
				else {
					node = this.next(node);
				}
			}
		}
		else {
			console.log("list is empty");
		}
	};
}