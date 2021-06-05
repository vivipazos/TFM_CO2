
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
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
        const prop_values = options.props || {};
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
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
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

    /* src/components/Budget.svelte generated by Svelte v3.31.0 */

    const file = "src/components/Budget.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    // (17:4) {#each data_modified as data}
    function create_each_block(ctx) {
    	let p;
    	let t1;
    	let div;
    	let button;
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = `${d.description}`;
    			t1 = space();
    			div = element("div");
    			button = element("button");
    			button.textContent = `${d.action}`;
    			t3 = space();
    			add_location(p, file, 17, 8, 243);
    			add_location(button, file, 22, 12, 315);
    			add_location(div, file, 21, 8, 297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", toggle, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(17:4) {#each data_modified as data}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div0;
    	let t;
    	let div1;
    	let each_value = data_modified;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "budgetBar svelte-139opvo");
    			add_location(div0, file, 11, 1, 159);
    			add_location(div1, file, 15, 0, 195);
    			add_location(main, file, 10, 0, 151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(main, t);
    			append_dev(main, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*toggle, d*/ 0) {
    				each_value = data_modified;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
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
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
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

    function toggle() {
    	data_modified.map(d => {
    		d.active = d.active ? false : true;
    		return d;
    	});
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Budget", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Budget> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ toggle });
    	return [];
    }

    class Budget extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Budget",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.31.0 */
    const file$1 = "src/App.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let budget;
    	let t0;
    	let multiline;
    	let t1;
    	let line;
    	let t2;
    	let sankey;
    	let t3;
    	let area;
    	let t4;
    	let div0;
    	let p0;
    	let t6;
    	let button0;
    	let t8;
    	let button1;
    	let t10;
    	let scattercanvas0;
    	let t11;
    	let div1;
    	let p1;
    	let t13;
    	let button2;
    	let t15;
    	let button3;
    	let t17;
    	let scattercanvas1;
    	let t18;
    	let bars;
    	let t19;
    	let scatter;
    	let t20;
    	let map;
    	let current;
    	let mounted;
    	let dispose;
    	budget = new Budget({ $$inline: true });

    	multiline = new Multiline({
    			props: {
    				data: weather2,
    				title: "Title",
    				desc: "Description",
    				key: { x: "time", y: ["ny1", "sf1", "au1"] },
    				format,
    				color: ["#fc0", "#036", "#f0c"],
    				layout: "col"
    			},
    			$$inline: true
    		});

    	line = new Line({
    			props: {
    				data: weather,
    				title: "Title",
    				desc: "Description",
    				key: { x: "time", y: "value" },
    				format,
    				color,
    				layout: "col"
    			},
    			$$inline: true
    		});

    	sankey = new Sankey({
    			props: {
    				data: sankeydata,
    				colorNodes: func,
    				colorLinks: func_1,
    				layout: "col"
    			},
    			$$inline: true
    		});

    	area = new Area({
    			props: {
    				data: weather,
    				title: "Title",
    				desc: "Description",
    				key: { x: "time", y: "value" },
    				format,
    				color,
    				layout: "col"
    			},
    			$$inline: true
    		});

    	scattercanvas0 = new ScatterCanvas({
    			props: {
    				data: points,
    				layout: "wide",
    				step: scatterStep,
    				mark: "square"
    			},
    			$$inline: true
    		});

    	scattercanvas1 = new ScatterCanvas({
    			props: {
    				data: otherPoints,
    				layout: "wide",
    				step: otherStep,
    				mark: "circle"
    			},
    			$$inline: true
    		});

    	bars = new Bars({
    			props: {
    				data: weather,
    				title: "Title",
    				desc: "Description",
    				key: { x: "time", y: "value" },
    				color,
    				layout: "col"
    			},
    			$$inline: true
    		});

    	scatter = new Scatter({
    			props: {
    				data: weather3,
    				title: "Title",
    				desc: "Description",
    				key: {
    					x: "pressure",
    					y: "temperatureHigh",
    					size: "moonPhase"
    				},
    				format,
    				color,
    				layout: "col"
    			},
    			$$inline: true
    		});

    	map = new Map({
    			props: {
    				data: cases.data,
    				map: world,
    				geo: "countries",
    				scale: palette(),
    				projection,
    				join: { data: "geoid", map: "alpha3" },
    				value: "latest.cases",
    				legend: { title: "", format: "" },
    				layout: "wide"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(budget.$$.fragment);
    			t0 = space();
    			create_component(multiline.$$.fragment);
    			t1 = space();
    			create_component(line.$$.fragment);
    			t2 = space();
    			create_component(sankey.$$.fragment);
    			t3 = space();
    			create_component(area.$$.fragment);
    			t4 = space();
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "This is an example of how you can do smooth transitions. It uses canvas so you can do a few thousand elements. Instead of the buttons triggering which step is in view, you can use the scroll ...";
    			t6 = space();
    			button0 = element("button");
    			button0.textContent = "Arrange like so";
    			t8 = space();
    			button1 = element("button");
    			button1.textContent = "Rearrange again";
    			t10 = space();
    			create_component(scattercanvas0.$$.fragment);
    			t11 = space();
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "This is an example of how you can do smooth transitions. It uses canvas so you can do a few thousand elements. Instead of the buttons triggering which step is in view, you can use the scroll ...";
    			t13 = space();
    			button2 = element("button");
    			button2.textContent = "Arrange like so";
    			t15 = space();
    			button3 = element("button");
    			button3.textContent = "Rearrange again";
    			t17 = space();
    			create_component(scattercanvas1.$$.fragment);
    			t18 = space();
    			create_component(bars.$$.fragment);
    			t19 = space();
    			create_component(scatter.$$.fragment);
    			t20 = space();
    			create_component(map.$$.fragment);
    			add_location(p0, file$1, 46, 2, 670);
    			add_location(button0, file$1, 47, 2, 876);
    			add_location(button1, file$1, 48, 2, 944);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$1, 45, 1, 650);
    			add_location(p1, file$1, 58, 2, 1129);
    			add_location(button2, file$1, 59, 2, 1335);
    			add_location(button3, file$1, 60, 2, 1401);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$1, 57, 1, 1109);
    			attr_dev(main, "class", "svelte-16syy7i");
    			add_location(main, file$1, 7, 0, 73);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(budget, main, null);
    			append_dev(main, t0);
    			mount_component(multiline, main, null);
    			append_dev(main, t1);
    			mount_component(line, main, null);
    			append_dev(main, t2);
    			mount_component(sankey, main, null);
    			append_dev(main, t3);
    			mount_component(area, main, null);
    			append_dev(main, t4);
    			append_dev(main, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t6);
    			append_dev(div0, button0);
    			append_dev(div0, t8);
    			append_dev(div0, button1);
    			append_dev(main, t10);
    			mount_component(scattercanvas0, main, null);
    			append_dev(main, t11);
    			append_dev(main, div1);
    			append_dev(div1, p1);
    			append_dev(div1, t13);
    			append_dev(div1, button2);
    			append_dev(div1, t15);
    			append_dev(div1, button3);
    			append_dev(main, t17);
    			mount_component(scattercanvas1, main, null);
    			append_dev(main, t18);
    			mount_component(bars, main, null);
    			append_dev(main, t19);
    			mount_component(scatter, main, null);
    			append_dev(main, t20);
    			mount_component(map, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[0], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[1], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[2], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(budget.$$.fragment, local);
    			transition_in(multiline.$$.fragment, local);
    			transition_in(line.$$.fragment, local);
    			transition_in(sankey.$$.fragment, local);
    			transition_in(area.$$.fragment, local);
    			transition_in(scattercanvas0.$$.fragment, local);
    			transition_in(scattercanvas1.$$.fragment, local);
    			transition_in(bars.$$.fragment, local);
    			transition_in(scatter.$$.fragment, local);
    			transition_in(map.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(budget.$$.fragment, local);
    			transition_out(multiline.$$.fragment, local);
    			transition_out(line.$$.fragment, local);
    			transition_out(sankey.$$.fragment, local);
    			transition_out(area.$$.fragment, local);
    			transition_out(scattercanvas0.$$.fragment, local);
    			transition_out(scattercanvas1.$$.fragment, local);
    			transition_out(bars.$$.fragment, local);
    			transition_out(scatter.$$.fragment, local);
    			transition_out(map.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(budget);
    			destroy_component(multiline);
    			destroy_component(line);
    			destroy_component(sankey);
    			destroy_component(area);
    			destroy_component(scattercanvas0);
    			destroy_component(scattercanvas1);
    			destroy_component(bars);
    			destroy_component(scatter);
    			destroy_component(map);
    			mounted = false;
    			run_all(dispose);
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

    const func = d => "#00bbff";
    const func_1 = d => "#00bbff35";

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => scatterStep = 0;
    	const click_handler_1 = () => scatterStep = 1;
    	const click_handler_2 = () => otherStep = 0;
    	const click_handler_3 = () => otherStep = 1;
    	$$self.$capture_state = () => ({ Budget });
    	return [click_handler, click_handler_1, click_handler_2, click_handler_3];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    // const url = 'URL to your JSON data';

    // fetch(url)
    //   .then((res) => res.json())
    //   .then((json) => {
    // 	const data = json;

    //     const app = new App({
    //       target: document.body,
    //       props: {
    // 		data: data
    // 		/*You can also pass each object in 'data' as an individual prop.
    // 		For example:
    // 			meta: data.meta,
    // 			menu: data.menu,
    // 			content: data.content
    			
    // 			OR

    // 			data:{...data}
    // 		*/
    //       }
    // 	});
    // });

    const app = new App({target: document.body});

    return app;

}());
//# sourceMappingURL=bundle.js.map
