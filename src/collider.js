const COLLISIONEVENT = 0;

class Collider {
    constructor() {
        this.rects = [];
    }
    addRect(owner, left, top, width, height) {
        this.rects.push({owner: owner, left: left, top: top, width: width, height: height});
    }
    clear() {
        this.rects = [];
    }
    checkCollisions() {
        for (var i = 0; i < this.rects.length; i++) {
            var first = this.rects[i];
            for (var j = i+1; j < this.rects.length; j++) {
                var second = this.rects[j];
                if (first.owner === second.owner) continue; // simple
                if (checkRectOverlap(first, second)) {
                    var eventType = COLLISIONEVENT;
                    first.owner.receiveMessage({eventType: eventType, otherCollider: second.owner});
                    second.owner.receiveMessage({eventType: eventType, otherCollider: first.owner});
                }
            }
        }
    }
}

function checkRectOverlap(r1, r2) {
    left1 = r1.left, left2 = r2.left;
    right1 = r1.left + r1.width, right2 = r2.left + r2.width;
    top1 = r1.top, top2 = r2.top;
    bottom1 = r1.top + r1.height, bottom2 = r2.top + r2.height;
    return !((left1 > right2 || left2 > right1 || bottom1 > top2 || bottom2 > top1))
}