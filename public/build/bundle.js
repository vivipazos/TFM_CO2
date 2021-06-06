
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Budget.svelte generated by Svelte v3.38.2 */

    const file = "src/components/Budget.svelte";

    function create_fragment(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "budgetBar svelte-1xqy5ao");
    			add_location(div, file, 5, 1, 38);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Budget", slots, []);
    	let { data } = $$props;
    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Budget> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ data });

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data];
    }

    class Budget extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Budget",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<Budget> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Budget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Budget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Action.svelte generated by Svelte v3.38.2 */

    const file$1 = "src/components/Action.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let p;
    	let t0;
    	let t1;
    	let label_1;
    	let input;
    	let t2;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(/*desc*/ ctx[1]);
    			t1 = space();
    			label_1 = element("label");
    			input = element("input");
    			t2 = space();
    			span = element("span");
    			add_location(p, file$1, 14, 4, 238);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-ffcaap");
    			add_location(input, file$1, 19, 8, 302);
    			attr_dev(span, "class", "slider round svelte-ffcaap");
    			add_location(span, file$1, 20, 8, 356);
    			attr_dev(label_1, "class", "switch svelte-ffcaap");
    			add_location(label_1, file$1, 18, 4, 271);
    			attr_dev(div, "class", "action svelte-ffcaap");
    			add_location(div, file$1, 13, 0, 213);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    			append_dev(div, label_1);
    			append_dev(label_1, input);
    			input.checked = /*active*/ ctx[0];
    			append_dev(label_1, t2);
    			append_dev(label_1, span);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[8]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*desc*/ 2) set_data_dev(t0, /*desc*/ ctx[1]);

    			if (dirty & /*active*/ 1) {
    				input.checked = /*active*/ ctx[0];
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Action", slots, []);
    	let { desc } = $$props;
    	let { category } = $$props;
    	let { label } = $$props;
    	let { amount_all } = $$props;
    	let { amount_some } = $$props;
    	let { amount_some_desc } = $$props;
    	let { source } = $$props;
    	let { active } = $$props;

    	const writable_props = [
    		"desc",
    		"category",
    		"label",
    		"amount_all",
    		"amount_some",
    		"amount_some_desc",
    		"source",
    		"active"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Action> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		active = this.checked;
    		$$invalidate(0, active);
    	}

    	$$self.$$set = $$props => {
    		if ("desc" in $$props) $$invalidate(1, desc = $$props.desc);
    		if ("category" in $$props) $$invalidate(2, category = $$props.category);
    		if ("label" in $$props) $$invalidate(3, label = $$props.label);
    		if ("amount_all" in $$props) $$invalidate(4, amount_all = $$props.amount_all);
    		if ("amount_some" in $$props) $$invalidate(5, amount_some = $$props.amount_some);
    		if ("amount_some_desc" in $$props) $$invalidate(6, amount_some_desc = $$props.amount_some_desc);
    		if ("source" in $$props) $$invalidate(7, source = $$props.source);
    		if ("active" in $$props) $$invalidate(0, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({
    		desc,
    		category,
    		label,
    		amount_all,
    		amount_some,
    		amount_some_desc,
    		source,
    		active
    	});

    	$$self.$inject_state = $$props => {
    		if ("desc" in $$props) $$invalidate(1, desc = $$props.desc);
    		if ("category" in $$props) $$invalidate(2, category = $$props.category);
    		if ("label" in $$props) $$invalidate(3, label = $$props.label);
    		if ("amount_all" in $$props) $$invalidate(4, amount_all = $$props.amount_all);
    		if ("amount_some" in $$props) $$invalidate(5, amount_some = $$props.amount_some);
    		if ("amount_some_desc" in $$props) $$invalidate(6, amount_some_desc = $$props.amount_some_desc);
    		if ("source" in $$props) $$invalidate(7, source = $$props.source);
    		if ("active" in $$props) $$invalidate(0, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		active,
    		desc,
    		category,
    		label,
    		amount_all,
    		amount_some,
    		amount_some_desc,
    		source,
    		input_change_handler
    	];
    }

    class Action extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			desc: 1,
    			category: 2,
    			label: 3,
    			amount_all: 4,
    			amount_some: 5,
    			amount_some_desc: 6,
    			source: 7,
    			active: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Action",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*desc*/ ctx[1] === undefined && !("desc" in props)) {
    			console.warn("<Action> was created without expected prop 'desc'");
    		}

    		if (/*category*/ ctx[2] === undefined && !("category" in props)) {
    			console.warn("<Action> was created without expected prop 'category'");
    		}

    		if (/*label*/ ctx[3] === undefined && !("label" in props)) {
    			console.warn("<Action> was created without expected prop 'label'");
    		}

    		if (/*amount_all*/ ctx[4] === undefined && !("amount_all" in props)) {
    			console.warn("<Action> was created without expected prop 'amount_all'");
    		}

    		if (/*amount_some*/ ctx[5] === undefined && !("amount_some" in props)) {
    			console.warn("<Action> was created without expected prop 'amount_some'");
    		}

    		if (/*amount_some_desc*/ ctx[6] === undefined && !("amount_some_desc" in props)) {
    			console.warn("<Action> was created without expected prop 'amount_some_desc'");
    		}

    		if (/*source*/ ctx[7] === undefined && !("source" in props)) {
    			console.warn("<Action> was created without expected prop 'source'");
    		}

    		if (/*active*/ ctx[0] === undefined && !("active" in props)) {
    			console.warn("<Action> was created without expected prop 'active'");
    		}
    	}

    	get desc() {
    		throw new Error("<Action>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set desc(value) {
    		throw new Error("<Action>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get category() {
    		throw new Error("<Action>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<Action>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Action>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Action>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get amount_all() {
    		throw new Error("<Action>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set amount_all(value) {
    		throw new Error("<Action>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get amount_some() {
    		throw new Error("<Action>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set amount_some(value) {
    		throw new Error("<Action>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get amount_some_desc() {
    		throw new Error("<Action>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set amount_some_desc(value) {
    		throw new Error("<Action>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get source() {
    		throw new Error("<Action>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set source(value) {
    		throw new Error("<Action>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Action>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Action>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/common/Text.svelte generated by Svelte v3.38.2 */

    const file$2 = "src/components/common/Text.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (6:2) {#each text as p}
    function create_each_block(ctx) {
    	let p;
    	let raw_value = /*p*/ ctx[1].p + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			add_location(p, file$2, 6, 6, 99);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 1 && raw_value !== (raw_value = /*p*/ ctx[1].p + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(6:2) {#each text as p}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let each_value = /*text*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section, "class", "col-text text");
    			add_location(section, file$2, 4, 0, 41);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) {
    				each_value = /*text*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Text", slots, []);
    	let { text } = $$props;
    	const writable_props = ["text"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !("text" in props)) {
    			console.warn("<Text> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var data = [
    	{
    		action: "Eat less meat",
    		CO2: 5130,
    		description: "If everyone in the world ate red meat just once a week (flexitarian), we could save about 5,130 MtC02eq. However, not every country consumes meat the same. If this figure is weighted towards those who consume more meat, by just looking at the top 20 countries, we can account for more than 75% of this amount."
    	},
    	{
    		action: "Reduce all transport emissions by 20%",
    		CO2: 9452,
    		description: "Transport emissions are one of the largest contributors. Although this is largely attributed to private cars and freight, if we could shift choices towards more public transport, more efficient vehicles and less distance travelled, there could be a significant drop in carbon added to the atmosphere."
    	},
    	{
    		action: "Increase renewable energy",
    		CO2: 467,
    		description: "Two thirds of global greenhouse gas emissions come from the production and use of energy. In 2015, just 16% of the world’s energy supply came from solar, wind and other renewable sources. If we can get that figure up to 65% by 2050 - a shift that researchers say is both technically and financially feasible - then we can prevent 14,000 million tonnes of carbon dioxide emissions"
    	}
    ];

    /* src/App.svelte generated by Svelte v3.38.2 */

    const { console: console_1 } = globals;
    const file$3 = "src/App.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[8] = list;
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (26:39) 
    function create_if_block_2(ctx) {
    	let budget;
    	let t;
    	let each_1_anchor;
    	let current;

    	budget = new Budget({
    			props: { data: /*data_modified*/ ctx[2] },
    			$$inline: true
    		});

    	let each_value_1 = /*actions*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(budget.$$.fragment);
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(budget, target, anchor);
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*actions*/ 1) {
    				each_value_1 = /*actions*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(budget.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(budget.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(budget, detaching);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(26:39) ",
    		ctx
    	});

    	return block;
    }

    // (24:37) 
    function create_if_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file$3, 24, 1, 526);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(24:37) ",
    		ctx
    	});

    	return block;
    }

    // (22:1) {#if block.type === 'text'}
    function create_if_block(ctx) {
    	let text_1;
    	let current;
    	const text_1_spread_levels = [/*block*/ ctx[4]];
    	let text_1_props = {};

    	for (let i = 0; i < text_1_spread_levels.length; i += 1) {
    		text_1_props = assign(text_1_props, text_1_spread_levels[i]);
    	}

    	text_1 = new Text({ props: text_1_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = (dirty & /*content*/ 2)
    			? get_spread_update(text_1_spread_levels, [get_spread_object(/*block*/ ctx[4])])
    			: {};

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(22:1) {#if block.type === 'text'}",
    		ctx
    	});

    	return block;
    }

    // (30:1) {#each actions as object}
    function create_each_block_1(ctx) {
    	let action;
    	let updating_active;
    	let current;
    	const action_spread_levels = [/*object*/ ctx[7]];

    	function action_active_binding(value) {
    		/*action_active_binding*/ ctx[3](value, /*object*/ ctx[7]);
    	}

    	let action_props = {};

    	for (let i = 0; i < action_spread_levels.length; i += 1) {
    		action_props = assign(action_props, action_spread_levels[i]);
    	}

    	if (/*object*/ ctx[7].active !== void 0) {
    		action_props.active = /*object*/ ctx[7].active;
    	}

    	action = new Action({ props: action_props, $$inline: true });
    	binding_callbacks.push(() => bind(action, "active", action_active_binding));

    	const block = {
    		c: function create() {
    			create_component(action.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(action, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const action_changes = (dirty & /*actions*/ 1)
    			? get_spread_update(action_spread_levels, [get_spread_object(/*object*/ ctx[7])])
    			: {};

    			if (!updating_active && dirty & /*actions*/ 1) {
    				updating_active = true;
    				action_changes.active = /*object*/ ctx[7].active;
    				add_flush_callback(() => updating_active = false);
    			}

    			action.$set(action_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(action.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(action.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(action, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(30:1) {#each actions as object}",
    		ctx
    	});

    	return block;
    }

    // (20:1) {#each content as block}
    function create_each_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*block*/ ctx[4].type === "text") return 0;
    		if (/*block*/ ctx[4].type === "scroller") return 1;
    		if (/*block*/ ctx[4].type === "calculator") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(20:1) {#each content as block}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let current;
    	let each_value = /*content*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(main, "class", "svelte-1awux1t");
    			add_location(main, file$3, 18, 0, 402);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*content, actions, data_modified*/ 7) {
    				each_value = /*content*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { content } = $$props;
    	let { actions } = $$props;

    	let data_modified = actions.map(d => {
    		d.active = false;
    		d.shown = false;
    		return d;
    	});

    	console.log(actions);
    	const writable_props = ["content", "actions"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function action_active_binding(value, object) {
    		if ($$self.$$.not_equal(object.active, value)) {
    			object.active = value;
    			$$invalidate(0, actions);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ("content" in $$props) $$invalidate(1, content = $$props.content);
    		if ("actions" in $$props) $$invalidate(0, actions = $$props.actions);
    	};

    	$$self.$capture_state = () => ({
    		Budget,
    		Action,
    		Text,
    		data,
    		content,
    		actions,
    		data_modified
    	});

    	$$self.$inject_state = $$props => {
    		if ("content" in $$props) $$invalidate(1, content = $$props.content);
    		if ("actions" in $$props) $$invalidate(0, actions = $$props.actions);
    		if ("data_modified" in $$props) $$invalidate(2, data_modified = $$props.data_modified);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [actions, content, data_modified, action_active_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { content: 1, actions: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*content*/ ctx[1] === undefined && !("content" in props)) {
    			console_1.warn("<App> was created without expected prop 'content'");
    		}

    		if (/*actions*/ ctx[0] === undefined && !("actions" in props)) {
    			console_1.warn("<App> was created without expected prop 'actions'");
    		}
    	}

    	get content() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get actions() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set actions(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var article = [
    	{
    		type: "head",
    		head: "",
    		subhead: ""
    	},
    	{
    		type: "scroller",
    		steps: [
    			{
    				h3: "",
    				p: ""
    			},
    			{
    				h3: "",
    				p: ""
    			},
    			{
    				h3: "",
    				p: ""
    			},
    			{
    				h3: "",
    				p: ""
    			}
    		]
    	},
    	{
    		type: "sectors"
    	},
    	{
    		type: "calculator"
    	}
    ];
    var story = {
    	article: article
    };

    var actions = [
    	{
    		category: "Individual",
    		label: "Recycling",
    		desc: "",
    		amount_all: "104",
    		amount_some: "",
    		amount_some_desc: "",
    		source: ""
    	},
    	{
    		category: "Individual",
    		label: "Eat less meat",
    		desc: "If everyone in the world ate red meat just once a week (flexitarian), we could save about 5,130 Mt C02eq. However, not every country consumes meat the same. If this figure is weighted towards those who consume more meat, by just looking at the top 20 countries, we can account for more than 75% of this amount.",
    		amount_all: "5130",
    		amount_some: "3731",
    		amount_some_desc: "Top 20 largest meat consumers.",
    		source: "FOA, Article: Options for keeping the food system within environmental limits, IPCC Diet recommendations"
    	},
    	{
    		category: "Individual",
    		label: "Reduce all transport emissions by 20%",
    		desc: "Transport emissions are one of the largest contributors. Although this is largely attributed to private cars and freight, if we could shift choices towards more public transport, more efficient vehicles and less distance travelled, there could be a significant drop in carbon added to the atmosphere.",
    		amount_all: "9452",
    		amount_some: "7446",
    		amount_some_desc: "High and upper-middle income countries only",
    		source: "ClimateWatch for transport emission and WorldBank for income classifications"
    	},
    	{
    		category: "Governments",
    		label: "Increase renewable energy",
    		desc: "Two thirds of global greenhouse gas emissions come from the production and use of energy. In 2015, just 16% of the world’s energy supply came from solar, wind and other renewable sources. If we can get that figure up to 65% by 2050 - a shift that researchers say is both technically and financially feasible - then we can prevent 14,000 million tonnes of carbon dioxide emissions",
    		amount_all: "467",
    		amount_some: "N/A",
    		amount_some_desc: "N/A",
    		source: "International Renewable Energy Agency 2017 report"
    	},
    	{
    		category: "Governments",
    		label: "Restore and protect forests and wetlands",
    		desc: "Forests store vast amounts of carbon. Mangroves, salt marshes, freshwater wetlands, bogs and peatlands are less extensive than forests and grasslands, but they contain enormous stocks of carbon. Protecting and restoring all of these natural resources presents an enormous opportunity of reduce our emissions.",
    		amount_all: "528",
    		amount_some: "N/A",
    		amount_some_desc: "N/A",
    		source: "Proceedings of the National Academy of Sciences of the United States of America. Report 2017. Sectoral greenhouse gas emission reduction potential in 2030 by UNEP."
    	},
    	{
    		category: "Governments",
    		label: "Build our cities more sustainably",
    		desc: "",
    		amount_all: "80",
    		amount_some: "",
    		amount_some_desc: "",
    		source: ""
    	},
    	{
    		category: "Industry",
    		label: "Coal, petrol and oil companies",
    		desc: "The largest contributors to carbon emissions have historically been from petrol, oil and coal mining companies. These companies contributed around 35% of greenhouse gas emissions in 2018 alone. Dropping their emissions, even by half, would make a huge impact.",
    		amount_all: "14152",
    		amount_some: "7076",
    		amount_some_desc: "Top 20 companies reduce emissions by half.",
    		source: "Source: Carbon Majors, Climate Accountability "
    	},
    	{
    		category: "Industry",
    		label: "Fast fashion",
    		desc: "",
    		amount_all: "1006",
    		amount_some: "",
    		amount_some_desc: "",
    		source: ""
    	},
    	{
    		category: "Industry",
    		label: "Third option",
    		desc: "",
    		amount_all: "",
    		amount_some: "",
    		amount_some_desc: "",
    		source: ""
    	}
    ];

    const app = new App({
        target: document.body,
        props:{
            content:story.article,
            actions:actions
        } 
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
