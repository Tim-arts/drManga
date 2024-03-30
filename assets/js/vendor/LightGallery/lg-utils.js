
/*
 *@todo remove function from window and document. Update on and off functions
 */
window.getAttribute = function(label) {
    return window[label];
};

window.setAttribute = function(label, value) {
    window[label] = value;
};

document.getAttribute = function(label) {
    return document[label];
};

document.setAttribute = function(label, value) {
    document[label] = value;
};

let utils = {
    wrap: function(el, className) {
        if (!el) {
            return;
        }

        let wrapper = document.createElement('div');
        wrapper.className = className;
        el.parentNode.insertBefore(wrapper, el);
        el.parentNode.removeChild(el);
        wrapper.appendChild(el);
    },

    addReferenceEvents: function (el, events) {
        if (!el) {
            return;
        }

        let currentEvents = el.getAttribute('lg-events');

        if (currentEvents) {
            let newEvents = events.split(' '),
                result;
            currentEvents = [currentEvents];

            result = [...new Set([...newEvents, ...currentEvents])].join(' ');
            el.setAttribute('lg-events', result);
        } else {
            el.setAttribute('lg-events', events);
        }
    },

    removeReferenceEvents: function (el, events) {
        if (!el) {
            return;
        }

        if (events) {
            let currentEvents = el.getAttribute('lg-events');
            events = events.split(' ');

            for (let currEvent in events) {
                currentEvents.replace(events[currEvent], '');
            }

            if (currentEvents.trim() === '') {
                el.removeAttribute('lg-events');
            }
        } else {
            el.removeAttribute('lg-events');
        }
    },

    hasReferenceEvents: function (el, events) {
        if (!el) {
            return;
        }

        let attributes = el.getAttribute('lg-events');

        if (!attributes) {
            this.addReferenceEvents(el, events);

            return false;
        }

        attributes = attributes.split(' ');
        events = events.split(' ');

        return attributes.some(r => events.indexOf(r) >= 0);
    },

    addClass: function(el, className) {
        if (!el) {
            return;
        }

        let classes = className.split(' ');

        for (let _class in classes) {
            let thisClass = classes[_class];

            if (el.classList) {
                el.classList.add(thisClass);
            } else {
                el.className += ' ' + thisClass;
            }
        }
    },

    removeClass: function(el, className) {
        if (!el) {
            return;
        }

        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    },

    hasClass: function(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    },

    // ex Transform
    // ex TransitionTimingFunction
    setVendor: function(el, property, value) {
        if (!el) {
            return;
        }

        el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
        el.style['webkit' + property] = value;
        el.style['moz' + property] = value;
        el.style['ms' + property] = value;
        el.style['o' + property] = value;
    },

    trigger: function(el, event, detail = null, callback) {
        if (!el) {
            return;
        }

        let customEvent = new CustomEvent(event, {
            detail: detail
        });
        el.dispatchEvent(customEvent);

        // Execute callback
        if (callback && (typeof callback === 'function')) {
            callback();
        }
    },

    Listener: {
        uid: 0
    },
    on: function(el, events, fn) {
        if (!el) {
            return;
        }

        events.split(' ').forEach(event => {
            let _id = el.getAttribute('lg-event-uid') || '';
            utils.Listener.uid++;
            _id += '&' + utils.Listener.uid;
            el.setAttribute('lg-event-uid', _id);
            utils.Listener[event + utils.Listener.uid] = fn;
            el.addEventListener(event.split('.')[0], fn, false);
        });

        if (el !== window) {
            this.addReferenceEvents(el, events);
        }
    },

    off: function(el, event, removeReferenceEvent) {
        if (!el) {
            return;
        }

        let _id = el.getAttribute('lg-event-uid');
        if (_id) {
            _id = _id.split('&');
            for (let i = 0; i < _id.length; i++) {
                if (_id[i]) {
                    let _event = event + _id[i];
                    if (_event.substring(0, 1) === '.') {
                        for (let key in utils.Listener) {
                            if (utils.Listener.hasOwnProperty(key)) {
                                if (key.split('.').indexOf(_event.split('.')[1]) > -1) {
                                    el.removeEventListener(key.split('.')[0], utils.Listener[key]);
                                    el.setAttribute('lg-event-uid', el.getAttribute('lg-event-uid').replace('&' + _id[i], ''));
                                    delete utils.Listener[key];
                                }
                            }
                        }
                    } else {
                        el.removeEventListener(_event.split('.')[0], utils.Listener[_event]);
                        el.setAttribute('lg-event-uid', el.getAttribute('lg-event-uid').replace('&' + _id[i], ''));
                        delete utils.Listener[_event];
                    }
                }
            }
        }

        if (el !== window) {
            if (removeReferenceEvent) {
                this.removeReferenceEvents(el, removeReferenceEvent);
            } else {
                this.removeReferenceEvents(el);
            }
        }
    },

    param: function(obj) {
        return Object.keys(obj).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        }).join('&');
    }
};

window.utils = {...utils, ...window.utils};