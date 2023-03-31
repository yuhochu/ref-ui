'use strict';
(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1754],
  {
    99319: (e, t, s) => {
      s.r(t),
        s.d(t, {
          Components: () => l,
          showDefaultSearchDialog: () => h,
          showSymbolSearchItemsDialog: () => r.showSymbolSearchItemsDialog,
        });
      var a = s(24287),
        i = (s(96404), s(72454)),
        n = s(20480),
        r = s(9772),
        o = s(22900);
      s(27490), s(43367);
      !(0, o.isOnMobileAppPage)('any') &&
        window.matchMedia('(min-width: 602px) and (min-height: 445px)').matches;
      function h(e) {
        const t = (0, n.getSymbolSearchCompleteOverrideFunction)(),
          {
            defaultValue: s,
            showSpreadActions: o,
            source: h,
            onSearchComplete: l,
            ...u
          } = e,
          c = {
            ...u,
            showSpreadActions: null != o ? o : (0, i.canShowSpreadActions)(),
            onSearchComplete: (e) => {
              t(e[0].symbol).then((e) => {
                a.linking.symbol.setValue(e), null == l || l(e);
              });
            },
          };
        (0, r.showSymbolSearchItemsDialog)({ ...c, defaultValue: s });
      }
      const l = {
        SymbolSearchWatchlistDialogContentItem: null,
        SymbolSearchWatchlistDialog: null,
      };
    },
    68521: (e, t, s) => {
      s.d(t, { MatchMedia: () => i });
      var a = s(67294);
      class i extends a.PureComponent {
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
  },
]);
