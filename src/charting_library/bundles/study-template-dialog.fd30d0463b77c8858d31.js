(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [6631],
  {
    6120: (e) => {
      e.exports = {
        autocomplete: 'autocomplete-2wlTLOUu',
        caret: 'caret-2wlTLOUu',
        icon: 'icon-2wlTLOUu',
        suggestions: 'suggestions-2wlTLOUu',
        suggestion: 'suggestion-2wlTLOUu',
        noResults: 'noResults-2wlTLOUu',
        selected: 'selected-2wlTLOUu',
        opened: 'opened-2wlTLOUu',
      };
    },
    58644: (e) => {
      e.exports = {
        wrapper: 'wrapper-2eXD4rIf',
        input: 'input-2eXD4rIf',
        box: 'box-2eXD4rIf',
        icon: 'icon-2eXD4rIf',
        noOutline: 'noOutline-2eXD4rIf',
        'intent-danger': 'intent-danger-2eXD4rIf',
        check: 'check-2eXD4rIf',
        dot: 'dot-2eXD4rIf',
      };
    },
    28209: (e) => {
      e.exports = {
        checkbox: 'checkbox-2jiVkfto',
        reverse: 'reverse-2jiVkfto',
        label: 'label-2jiVkfto',
        baseline: 'baseline-2jiVkfto',
      };
    },
    33214: (e) => {
      e.exports = {
        loader: 'loader-38qh0l_K',
        static: 'static-38qh0l_K',
        item: 'item-38qh0l_K',
        'tv-button-loader': 'tv-button-loader-38qh0l_K',
        black: 'black-38qh0l_K',
        white: 'white-38qh0l_K',
        gray: 'gray-38qh0l_K',
        primary: 'primary-38qh0l_K',
        'loader-initial': 'loader-initial-38qh0l_K',
        'loader-appear': 'loader-appear-38qh0l_K',
      };
    },
    56436: (e) => {
      e.exports = { loading: 'loading-20Nb4yny' };
    },
    37457: (e) => {
      e.exports = {
        container: 'container-1FV_LSwA',
        withSuggestions: 'withSuggestions-1FV_LSwA',
        title: 'title-1FV_LSwA',
        autocomplete: 'autocomplete-1FV_LSwA',
        saveSymbol: 'saveSymbol-1FV_LSwA',
        saveInterval: 'saveInterval-1FV_LSwA',
        indicators: 'indicators-1FV_LSwA',
        hintLabel: 'hintLabel-1FV_LSwA',
        hintMark: 'hintMark-1FV_LSwA',
      };
    },
    32455: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 428px)',
      };
    },
    2632: (e) => {
      e.exports = { icon: 'icon-19OjtB6A', dropped: 'dropped-19OjtB6A' };
    },
    53400: (e, t, s) => {
      'use strict';
      s.d(t, { CheckboxInput: () => c });
      var n = s(67294),
        i = s(94184),
        o = s(49775),
        a = s(44805),
        r = s(58644),
        l = s.n(r);
      function c(e) {
        const t = i(l().box, l()['intent-' + e.intent], {
            [l().check]: !Boolean(e.indeterminate),
            [l().dot]: Boolean(e.indeterminate),
            [l().noOutline]: -1 === e.tabIndex,
          }),
          s = i(l().wrapper, e.className);
        return n.createElement(
          'span',
          { className: s, title: e.title },
          n.createElement('input', {
            id: e.id,
            tabIndex: e.tabIndex,
            className: l().input,
            type: 'checkbox',
            name: e.name,
            checked: e.checked,
            disabled: e.disabled,
            value: e.value,
            autoFocus: e.autoFocus,
            role: e.role,
            onChange: function () {
              e.onChange && e.onChange(e.value);
            },
            ref: e.reference,
          }),
          n.createElement(
            'span',
            { className: t },
            n.createElement(o.Icon, { icon: a, className: l().icon })
          )
        );
      }
    },
    37850: (e, t, s) => {
      'use strict';
      s.d(t, { Checkbox: () => c });
      var n = s(67294),
        i = s(94184),
        o = s(82604),
        a = s(53400),
        r = s(28209),
        l = s.n(r);
      class c extends n.PureComponent {
        render() {
          const { inputClassName: e, labelClassName: t, ...s } = this.props,
            o = i(this.props.className, l().checkbox, {
              [l().reverse]: Boolean(this.props.labelPositionReverse),
              [l().baseline]: Boolean(this.props.labelAlignBaseline),
            }),
            r = i(l().label, t, { [l().disabled]: this.props.disabled });
          let c = null;
          return (
            this.props.label &&
              (c = n.createElement(
                'span',
                { className: r, title: this.props.title },
                this.props.label
              )),
            n.createElement(
              'label',
              { className: o },
              n.createElement(a.CheckboxInput, { ...s, className: e }),
              c
            )
          );
        }
      }
      c.defaultProps = { value: 'on' };
      (0, o.makeSwitchGroupItem)(c);
    },
    73226: (e, t, s) => {
      'use strict';
      s.d(t, { Loader: () => c });
      var n,
        i = s(67294),
        o = s(94184),
        a = s(8596),
        r = s(33214),
        l = s.n(r);
      !(function (e) {
        (e[(e.Initial = 0)] = 'Initial'),
          (e[(e.Appear = 1)] = 'Appear'),
          (e[(e.Active = 2)] = 'Active');
      })(n || (n = {}));
      class c extends i.PureComponent {
        constructor(e) {
          super(e),
            (this._stateChangeTimeout = null),
            (this.state = { state: n.Initial });
        }
        render() {
          const {
              className: e,
              color: t = 'black',
              staticPosition: s,
            } = this.props,
            n = o(l().item, { [l()[t]]: Boolean(t) });
          return i.createElement(
            'span',
            {
              className: o(
                l().loader,
                s && l().static,
                e,
                this._getStateClass()
              ),
            },
            i.createElement('span', { className: n }),
            i.createElement('span', { className: n }),
            i.createElement('span', { className: n })
          );
        }
        componentDidMount() {
          this.setState({ state: n.Appear }),
            (this._stateChangeTimeout = setTimeout(() => {
              this.setState({ state: n.Active });
            }, 2 * a.dur));
        }
        componentWillUnmount() {
          this._stateChangeTimeout &&
            (clearTimeout(this._stateChangeTimeout),
            (this._stateChangeTimeout = null));
        }
        _getStateClass() {
          switch (this.state.state) {
            case n.Initial:
              return l()['loader-initial'];
            case n.Appear:
              return l()['loader-appear'];
            default:
              return '';
          }
        }
      }
    },
    82604: (e, t, s) => {
      'use strict';
      s.d(t, { SwitchGroup: () => o, makeSwitchGroupItem: () => a });
      var n = s(67294),
        i = s(45697);
      class o extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._subscriptions = new Set()),
            (this._getName = () => this.props.name),
            (this._getValues = () => this.props.values),
            (this._getOnChange = () => this.props.onChange),
            (this._subscribe = (e) => {
              this._subscriptions.add(e);
            }),
            (this._unsubscribe = (e) => {
              this._subscriptions.delete(e);
            });
        }
        getChildContext() {
          return {
            switchGroupContext: {
              getName: this._getName,
              getValues: this._getValues,
              getOnChange: this._getOnChange,
              subscribe: this._subscribe,
              unsubscribe: this._unsubscribe,
            },
          };
        }
        render() {
          return this.props.children;
        }
        componentDidUpdate(e) {
          this._notify(this._getUpdates(this.props.values, e.values));
        }
        _notify(e) {
          this._subscriptions.forEach((t) => t(e));
        }
        _getUpdates(e, t) {
          return [...t, ...e].filter((s) =>
            t.includes(s) ? !e.includes(s) : e.includes(s)
          );
        }
      }
      function a(e) {
        var t;
        return (
          ((t = class extends n.PureComponent {
            constructor() {
              super(...arguments),
                (this._onChange = (e) => {
                  this.context.switchGroupContext.getOnChange()(e);
                }),
                (this._onUpdate = (e) => {
                  e.includes(this.props.value) && this.forceUpdate();
                });
            }
            componentDidMount() {
              this.context.switchGroupContext.subscribe(this._onUpdate);
            }
            render() {
              return n.createElement(e, {
                ...this.props,
                name: this._getName(),
                onChange: this._onChange,
                checked: this._isChecked(),
              });
            }
            componentWillUnmount() {
              this.context.switchGroupContext.unsubscribe(this._onUpdate);
            }
            _getName() {
              return this.context.switchGroupContext.getName();
            }
            _isChecked() {
              return this.context.switchGroupContext
                .getValues()
                .includes(this.props.value);
            }
          }).contextTypes = { switchGroupContext: i.any.isRequired }),
          t
        );
      }
      o.childContextTypes = { switchGroupContext: i.any.isRequired };
    },
    74818: (e, t, s) => {
      'use strict';
      function n(e) {
        return o(e, a);
      }
      function i(e) {
        return o(e, r);
      }
      function o(e, t) {
        const s = Object.entries(e).filter(t),
          n = {};
        for (const [e, t] of s) n[e] = t;
        return n;
      }
      function a(e) {
        const [t, s] = e;
        return 0 === t.indexOf('data-') && 'string' == typeof s;
      }
      function r(e) {
        return 0 === e[0].indexOf('aria-');
      }
      s.d(t, {
        filterDataProps: () => n,
        filterAriaProps: () => i,
        filterProps: () => o,
        isDataAttribute: () => a,
        isAriaAttribute: () => r,
      });
    },
    10342: (e, t, s) => {
      'use strict';
      s.r(t), s.d(t, { StudyTemplateSaver: () => K });
      var n,
        i = s(16282),
        o = s(79881),
        a = s(67294),
        r = s(73935),
        l = (s(95068), s(94184)),
        c = s(37850),
        u = s(88262),
        h = s(92136),
        p = s(81829),
        d = s(13894);
      !(function (e) {
        (e[(e.Enter = 13)] = 'Enter'),
          (e[(e.Space = 32)] = 'Space'),
          (e[(e.Backspace = 8)] = 'Backspace'),
          (e[(e.DownArrow = 40)] = 'DownArrow'),
          (e[(e.UpArrow = 38)] = 'UpArrow'),
          (e[(e.RightArrow = 39)] = 'RightArrow'),
          (e[(e.LeftArrow = 37)] = 'LeftArrow'),
          (e[(e.Escape = 27)] = 'Escape'),
          (e[(e.Tab = 9)] = 'Tab');
      })(n || (n = {}));
      var m = s(6120);
      function g(e, t) {
        return '' === e || -1 !== t.toLowerCase().indexOf(e.toLowerCase());
      }
      class _ extends a.PureComponent {
        constructor(e) {
          if (
            (super(e),
            (this._setInputRef = (e) => {
              e &&
                ((this._inputElement = e),
                this.props.setupHTMLInput && this.props.setupHTMLInput(e),
                this._inputElement.addEventListener(
                  'keyup',
                  this._handleKeyUpEnter
                ));
            }),
            (this._handleCaretClick = () => {
              this.state.isOpened
                ? this.props.preventOnFocusOpen && this._focus()
                : this.props.preventOnFocusOpen
                ? this._open()
                : this._focus();
            }),
            (this._handleOutsideClick = () => {
              const {
                  allowUserDefinedValues: e,
                  value: t,
                  onChange: s,
                } = this.props,
                { queryValue: n } = this.state;
              e ? s && n !== t && s(n) : this.setState(this._valueToQuery(t)),
                this._close();
            }),
            (this._handleFocus = (e) => {
              this.props.preventOnFocusOpen || this._open(),
                this.props.onFocus && this.props.onFocus(e);
            }),
            (this._handleChange = (e) => {
              const {
                  preventSearchOnEmptyQuery: t,
                  allowUserDefinedValues: s,
                  onChange: n,
                  onSuggestionsOpen: i,
                  onSuggestionsClose: o,
                } = this.props,
                a = e.currentTarget.value;
              if (t && '' === a)
                this.setState({ queryValue: a, isOpened: !1, active: void 0 }),
                  o && o();
              else {
                const e = this._suggestions(a),
                  t = Object.keys(e).length > 0;
                this.setState({
                  queryValue: a,
                  isOpened: t,
                  active: s ? void 0 : this._getActiveKeyByValue(a),
                }),
                  t && i && i();
              }
              s && n && n(a);
            }),
            (this._handleItemClick = (e) => {
              const t = e.currentTarget.id;
              this.setState({ queryValue: this._source()[t] }),
                this.props.onChange && this.props.onChange(t),
                this._close();
            }),
            (this._handleKeyDown = (e) => {
              if (
                -1 ===
                [n.DownArrow, n.UpArrow, n.Enter, n.Escape].indexOf(e.which)
              )
                return;
              const {
                  allowUserDefinedValues: t,
                  value: s,
                  onChange: i,
                  onSuggestionsOpen: o,
                } = this.props,
                { active: a, isOpened: r, queryValue: l } = this.state;
              r && (e.preventDefault(), e.stopPropagation());
              const c = this._suggestions(l);
              switch (e.which) {
                case n.DownArrow:
                case n.UpArrow:
                  const u = Object.keys(c);
                  if (!r && u.length && e.which === n.DownArrow) {
                    this.setState({ isOpened: !0, active: u[0] }), o && o();
                    break;
                  }
                  let h;
                  if (void 0 === a) {
                    if (e.which === n.UpArrow) {
                      this._close();
                      break;
                    }
                    h = 0;
                  } else h = u.indexOf(a) + (e.which === n.UpArrow ? -1 : 1);
                  h < 0 && (h = 0), h > u.length - 1 && (h = u.length - 1);
                  const p = u[h];
                  this.setState({ active: p });
                  const d = document.getElementById(p);
                  d && this._scrollIfNotVisible(d, this._suggestionsElement);
                  break;
                case n.Escape:
                  this._close(), r || this._blur();
                  break;
                case n.Enter:
                  let m = a;
                  t &&
                    (r && m ? this.setState(this._valueToQuery(m)) : (m = l)),
                    void 0 !== m &&
                      (this._close(),
                      r || this._blur(),
                      m !== s
                        ? i && i(m)
                        : this.setState(this._valueToQuery(m)));
              }
            }),
            (this._setSuggestionsRef = (e) => {
              e && (this._suggestionsElement = e);
            }),
            (this._scrollIfNotVisible = (e, t) => {
              const s = t.scrollTop,
                n = t.scrollTop + t.clientHeight,
                i = e.offsetTop,
                o = i + e.clientHeight;
              i <= s ? e.scrollIntoView(!0) : o >= n && e.scrollIntoView(!1);
            }),
            !((e) => Array.isArray(e.source) || !e.allowUserDefinedValues)(e))
          )
            throw new Error(
              'allowUserDefinedProps === true cay only be used if source is array'
            );
          this.state = {
            isOpened: !1,
            active: e.value,
            ...this._valueToQuery(e.value),
          };
        }
        UNSAFE_componentWillReceiveProps(e) {
          const { allowUserDefinedValues: t, value: s } = e;
          if (s === this.props.value && this.state.isOpened) return;
          const n = t
            ? s
            : '' === s
            ? ''
            : this._source()[s] || this.state.queryValue;
          this.setState({ queryValue: n, active: s });
        }
        componentWillUnmount() {
          this._inputElement &&
            this._inputElement.removeEventListener(
              'keyup',
              this._handleKeyUpEnter
            );
        }
        render() {
          return a.createElement(
            d.OutsideEvent,
            { handler: this._handleOutsideClick, click: !0 },
            (e) =>
              a.createElement(
                'div',
                {
                  className: l(
                    m.autocomplete,
                    { [m.opened]: this.state.isOpened },
                    'js-dialog-skip-escape'
                  ),
                  ref: e,
                },
                a.createElement(p.InputControl, {
                  name: this.props.name,
                  endSlot: Object.keys(this._suggestions(this.state.queryValue))
                    .length
                    ? a.createElement(
                        h.EndSlot,
                        null,
                        a.createElement(
                          'span',
                          {
                            className: m.caret,
                            onClick: this._handleCaretClick,
                          },
                          a.createElement(u.ToolWidgetCaret, {
                            className: m.icon,
                            dropped: this.state.isOpened,
                          })
                        )
                      )
                    : void 0,
                  maxLength: this.props.maxLength,
                  reference: this._setInputRef,
                  stretch: !0,
                  placeholder: this.props.placeholder,
                  value: this.state.queryValue,
                  intent: this.props.error ? 'danger' : void 0,
                  onChange: this._handleChange,
                  onFocus: this._handleFocus,
                  onBlur: this.props.onBlur,
                  onMouseOver: this.props.onMouseOver,
                  onMouseOut: this.props.onMouseOut,
                  onKeyDown: this._handleKeyDown,
                  autoComplete: 'off',
                }),
                this._renderSuggestions()
              )
          );
        }
        _focus() {
          this._inputElement.focus();
        }
        _blur() {
          this._inputElement.blur();
        }
        _open() {
          const { onSuggestionsOpen: e } = this.props;
          this._focus(), this.setState({ isOpened: !0 }), e && e();
        }
        _close() {
          const { onSuggestionsClose: e } = this.props;
          this.setState({ isOpened: !1, active: void 0 }), e && e();
        }
        _source() {
          let e = {};
          return (
            Array.isArray(this.props.source)
              ? this.props.source.forEach((t) => {
                  e[t] = t;
                })
              : (e = this.props.source),
            e
          );
        }
        _suggestions(e) {
          const { filter: t = g } = this.props,
            s = this._source(),
            n = {};
          return (
            Object.keys(s)
              .filter((n) => t(e, s[n]))
              .forEach((e) => (n[e] = s[e])),
            n
          );
        }
        _renderSuggestions() {
          const e = this._suggestions(this.state.queryValue),
            t = Object.keys(e).map((t) => {
              const s = l(m.suggestion, {
                [m.selected]: this.state.active === t,
              });
              return a.createElement(
                'li',
                { id: t, key: t, className: s, onClick: this._handleItemClick },
                e[t]
              );
            }),
            s = a.createElement(
              'li',
              { className: m.noResults },
              (0, o.t)('No results found')
            );
          return !t.length && this.props.noEmptyText
            ? null
            : a.createElement(
                'ul',
                { className: m.suggestions, ref: this._setSuggestionsRef },
                t.length ? t : s
              );
        }
        _handleKeyUpEnter(e) {
          e.which === n.Enter && e.stopImmediatePropagation();
        }
        _getActiveKeyByValue(e) {
          const { filter: t = g } = this.props,
            s = this._suggestions(e),
            n = Object.keys(s);
          for (const i of n) if (t(e, s[i])) return i;
          return n[0];
        }
        _valueToQuery(e) {
          return { queryValue: this._source()[e] || '' };
        }
      }
      var v = s(49775),
        b = s(7591),
        f = s(78106),
        w = s(73226),
        S = s(56436);
      function y(e) {
        const { isLoading: t } = e;
        return a.createElement(
          'span',
          { className: t ? S.loading : void 0 },
          (0, o.t)('Save'),
          t && a.createElement(w.Loader, { color: 'white' })
        );
      }
      class C extends a.PureComponent {
        constructor(e) {
          super(e),
            (this._dialogRef = a.createRef()),
            (this._manager = null),
            (this._handleSubmit = () => {
              this.setState({ isLoading: !0 }), this.props.onSubmit(this);
            }),
            (this.state = { isLoading: !1 });
        }
        render() {
          const {
            isOpened: e,
            saveDisabled: t,
            title: s,
            onClose: n,
          } = this.props;
          return a.createElement(b.AdaptiveConfirmDialog, {
            ref: this._dialogRef,
            onClose: n,
            onSubmit: this._handleSubmit,
            onCancel: n,
            onClickOutside: n,
            isOpened: e,
            title: s,
            dataName: 'save-rename-dialog',
            render: this._renderDialogBody(),
            defaultActionOnClose: 'none',
            submitButtonText: a.createElement(y, {
              isLoading: this.state.isLoading,
            }),
            submitButtonDisabled: t,
          });
        }
        focus() {
          (0, i.ensureNotNull)(this._dialogRef.current).focus();
        }
        manager() {
          return this._manager;
        }
        submit() {
          this.props.onSubmit(this);
        }
        close() {
          this.props.onClose();
        }
        dropLoading() {
          this.setState({ isLoading: !1 });
        }
        _renderDialogBody() {
          return () =>
            a.createElement(
              f.SlotContext.Consumer,
              null,
              (e) => ((this._manager = e), this.props.children)
            );
        }
      }
      var x = s(33237),
        E = s(37457);
      const k = (0, o.t)('Template name'),
        O = (0, o.t)('Saved indicators'),
        T = (0, o.t)('Remember Symbol'),
        L = (0, o.t)('Remember Interval');
      function N(e) {
        const {
            title: t,
            saveSymbolHintText: s,
            saveIntervalHintText: n,
            indicatorsText: o,
            source: r,
            onClose: u,
            onSubmit: h,
          } = e,
          [p, d] = (0, a.useState)(''),
          [m, g] = (0, a.useState)(!1),
          [b, f] = (0, a.useState)(!1),
          [w, S] = (0, a.useState)(!1),
          y = (0, a.useRef)(null),
          N = (0, a.useRef)(null);
        return (
          (0, a.useEffect)(() => {
            (0, i.ensureNotNull)(N.current).focus();
          }, []),
          a.createElement(
            C,
            {
              ref: y,
              isOpened: !0,
              saveDisabled: !p,
              title: t,
              onClose: u,
              onSubmit: function (e) {
                h({ title: p, saveSymbol: m, saveInterval: b }, e);
              },
            },
            a.createElement(
              'div',
              { className: l(E.container, w && E.withSuggestions) },
              a.createElement('div', { className: E.title }, k),
              a.createElement(
                'div',
                { className: E.autocomplete },
                a.createElement(_, {
                  maxLength: 64,
                  value: p,
                  onChange: d,
                  onBlur: function () {
                    (0, i.ensureNotNull)(y.current).focus();
                  },
                  source: r,
                  allowUserDefinedValues: !0,
                  preventOnFocusOpen: !0,
                  noEmptyText: !0,
                  preventSearchOnEmptyQuery: !0,
                  filter: function (e, t) {
                    return Boolean(
                      '' === e ||
                        (e && -1 !== t.toLowerCase().indexOf(e.toLowerCase()))
                    );
                  },
                  setupHTMLInput: function (e) {
                    N.current = e;
                  },
                  onSuggestionsOpen: function () {
                    S(!0);
                  },
                  onSuggestionsClose: function () {
                    S(!1);
                  },
                })
              ),
              a.createElement(
                'div',
                { className: E.saveSymbol },
                a.createElement(c.Checkbox, {
                  label: a.createElement(
                    'span',
                    { className: E.hintLabel },
                    T,
                    a.createElement(v.Icon, {
                      icon: x,
                      className: l(E.hintMark, 'apply-common-tooltip'),
                      title: s,
                    })
                  ),
                  onChange: function () {
                    g(!m), (0, i.ensureNotNull)(y.current).focus();
                  },
                  checked: m,
                })
              ),
              a.createElement(
                'div',
                { className: E.saveInterval },
                a.createElement(c.Checkbox, {
                  label: a.createElement(
                    'span',
                    { className: E.hintLabel },
                    L,
                    a.createElement(v.Icon, {
                      icon: x,
                      className: l(E.hintMark, 'apply-common-tooltip'),
                      title: n,
                    })
                  ),
                  onChange: function () {
                    f(!b), (0, i.ensureNotNull)(y.current).focus();
                  },
                  checked: b,
                })
              ),
              a.createElement('div', { className: E.title }, O),
              a.createElement(
                'div',
                { className: l(E.indicators, w && E.withSuggestions) },
                o
              )
            )
          )
        );
      }
      var I = s(18437),
        A = s(28164);
      class D {
        constructor(e) {
          (this._container = document.createElement('div')),
            (this.close = () => {
              this.unmount(), this._onClose && this._onClose();
            }),
            (this.unmount = () => {
              I.unsubscribe(
                A.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
                this.unmount,
                null
              ),
                r.unmountComponentAtNode(this._container);
            }),
            (this._title = e.title),
            (this._saveSymbolHintText = e.saveSymbolHintText),
            (this._saveIntervalHintText = e.saveIntervalHintText),
            (this._indicatorsText = e.indicatorsText),
            (this._source = e.source),
            (this._onSubmit = e.onSubmit),
            (this._onClose = e.onClose),
            I.subscribe(A.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this.unmount, null);
        }
        mount() {
          r.render(
            a.createElement(N, {
              title: this._title,
              saveSymbolHintText: this._saveSymbolHintText,
              saveIntervalHintText: this._saveIntervalHintText,
              indicatorsText: this._indicatorsText,
              source: this._source,
              onClose: this.close,
              onSubmit: this._onSubmit,
            }),
            this._container
          );
        }
        destroy() {
          this.unmount();
        }
        show() {
          this.mount();
        }
      }
      var V = s(90774),
        U = s(87614),
        q = s(46786),
        M = s(33756);
      const B = (0, o.t)('Save Indicator Template'),
        P = (0, o.t)(
          'Selecting this option will set the {symbol} symbol on the chart when this template is applied'
        ),
        R = (0, o.t)(
          'Selecting this option will set the {interval} interval on the chart when this template is applied'
        ),
        F = (0, o.t)(
          "Study Template '{templateName}' already exists. Do you really want to replace it?"
        );
      function H(e, t, s) {
        const n = () => {
          V.backend.invalidateStudyTemplatesList(),
            V.backend.getStudyTemplatesList().then(t);
        };
        V.backend.saveStudyTemplate(e).then(n);
      }
      class K {
        constructor(e) {
          (this._dialog = null),
            (this._onSave = (e) => {
              this._options.onSave(e), this._close();
            }),
            (this._showSaveDialog = async () => {
              const e = this._controller.model().mainSeries().symbol(),
                t = this._controller.model().mainSeries().interval(),
                s = await this._getActualTemplateList();
              await this._showTemplateSaveRenameDialog(s, e, t);
            }),
            (this._close = () => {
              this._dialog && (this._dialog.destroy(), (this._dialog = null));
            }),
            (this._options = e),
            (this._controller = e.controller);
        }
        show() {
          window.runOrSignIn(this._showSaveDialog, {
            source: 'Study templates save as',
            sourceMeta: 'Chart',
          });
        }
        _prepareData(e, t, s) {
          const n = this._controller.model().studyTemplate(t, s);
          return {
            name: e,
            content: JSON.stringify(n),
            meta_info: (0, M.createStudyTemplateMetaInfo)(
              this._controller,
              n.interval
            ),
          };
        }
        _doSave(e, t, s) {
          const { title: n, saveSymbol: i, saveInterval: o } = t;
          if (!n) return;
          const a = s.manager() || void 0,
            r = this._prepareData(n, i, o);
          if (e.find((e) => e.name === n)) {
            const e = (e) => {
              e ? H(r, this._onSave) : (s.focus(), s.dropLoading());
            };
            (function (e, t) {
              return new Promise((s) =>
                (0, U.showConfirm)(
                  {
                    text: F.format({ templateName: e }),
                    onConfirm: ({ dialogClose: e }) => {
                      s(!0), e();
                    },
                    onClose: () => s(!1),
                  },
                  t
                )
              );
            })(n, a).then(e);
          } else {
            H(r, this._onSave);
          }
        }
        _getActualTemplateList() {
          return (
            V.backend.invalidateStudyTemplatesList(),
            V.backend.getStudyTemplatesList()
          );
        }
        _showTemplateSaveRenameDialog(e, t, s) {
          const n = (0, M.createStudyTemplateMetaInfo)(this._controller);
          (this._dialog = new D({
            source: e.map((e) => e.name),
            title: B,
            saveSymbolHintText: P.format({ symbol: t }),
            saveIntervalHintText: R.format({
              interval: (0, q.translatedIntervalString)(s),
            }),
            indicatorsText: (0, M.descriptionString)(n.indicators),
            onSubmit: (t, s) => this._doSave(e, t, s),
            onClose: this._close,
          })).show();
        }
      }
    },
    33756: (e, t, s) => {
      'use strict';
      s.d(t, {
        createStudyTemplateMetaInfo: () => i,
        descriptionString: () => o,
      });
      var n = s(17e3);
      function i(e, t) {
        return {
          indicators: e
            .orderedDataSources(!0)
            .filter((e) => (0, n.isStudy)(e) && !(0, n.isESDStudy)(e))
            .map((e) => ({
              id: e.metaInfo().id,
              description: e.title(!0, void 0, !0),
            })),
          interval: t,
        };
      }
      function o(e) {
        const t = new Map();
        return (
          e.forEach((e) => {
            const [s, n] = t.get(e.id) || [e.description, 0];
            t.set(e.id, [s, n + 1]);
          }),
          Array.from(t.values())
            .map(([e, t]) => `${e}${t > 1 ? ' x ' + t : ''}`)
            .join(', ')
        );
      }
    },
    59726: (e, t, s) => {
      'use strict';
      function n(e, t, s, n, i) {
        function o(i) {
          if (e > i.timeStamp) return;
          const o = i.target;
          void 0 !== s &&
            null !== t &&
            null !== o &&
            o.ownerDocument === n &&
            (t.contains(o) || s(i));
        }
        return (
          i.click && n.addEventListener('click', o, !1),
          i.mouseDown && n.addEventListener('mousedown', o, !1),
          i.touchEnd && n.addEventListener('touchend', o, !1),
          i.touchStart && n.addEventListener('touchstart', o, !1),
          () => {
            n.removeEventListener('click', o, !1),
              n.removeEventListener('mousedown', o, !1),
              n.removeEventListener('touchend', o, !1),
              n.removeEventListener('touchstart', o, !1);
          }
        );
      }
      s.d(t, { addOutsideEventListener: () => n });
    },
    72923: (e, t, s) => {
      'use strict';
      s.d(t, { DialogBreakpoints: () => i });
      var n = s(32455);
      const i = {
        SmallHeight: n['small-height-breakpoint'],
        TabletSmall: n['tablet-small-breakpoint'],
        TabletNormal: n['tablet-normal-breakpoint'],
      };
    },
    68521: (e, t, s) => {
      'use strict';
      s.d(t, { MatchMedia: () => i });
      var n = s(67294);
      class i extends n.PureComponent {
        constructor(e) {
          super(e),
            (this._handleChange = () => {
              this.forceUpdate();
            }),
            (this.state = { query: window.matchMedia(this.props.rule) });
        }
        componentDidMount() {
          this._subscribe(this.state.query);
        }
        componentDidUpdate(e, t) {
          this.state.query !== t.query &&
            (this._unsubscribe(t.query), this._subscribe(this.state.query));
        }
        componentWillUnmount() {
          this._unsubscribe(this.state.query);
        }
        render() {
          return this.props.children(this.state.query.matches);
        }
        static getDerivedStateFromProps(e, t) {
          return e.rule !== t.query.media
            ? { query: window.matchMedia(e.rule) }
            : null;
        }
        _subscribe(e) {
          e.addListener(this._handleChange);
        }
        _unsubscribe(e) {
          e.removeListener(this._handleChange);
        }
      }
    },
    88262: (e, t, s) => {
      'use strict';
      s.d(t, { ToolWidgetCaret: () => l });
      var n = s(67294),
        i = s(94184),
        o = s(49775),
        a = s(2632),
        r = s(85533);
      function l(e) {
        const { dropped: t, className: s } = e;
        return n.createElement(o.Icon, {
          className: i(s, a.icon, { [a.dropped]: t }),
          icon: r,
        });
      }
    },
    44805: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>';
    },
    85533: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>';
    },
    33237: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 8.5h1.5V14"/><circle fill="currentColor" cx="9" cy="5" r="1"/><path stroke="currentColor" d="M16.5 9a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z"/></svg>';
    },
  },
]);
