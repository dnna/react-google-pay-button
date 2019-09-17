import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/* eslint-disable react/no-unused-prop-types */

var GOOGLE_PAY_BUTTON_SDK_URL = 'https://pay.google.com/gp/p/js/pay.js';

var GPayButton = function (_PureComponent) {
  inherits(GPayButton, _PureComponent);

  function GPayButton() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, GPayButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = GPayButton.__proto__ || Object.getPrototypeOf(GPayButton)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      paymentsClientInitialised: false,
      paymentsClient: undefined
    }, _this.loadSDK = function () {
      var script = document.createElement('script');
      script.src = GOOGLE_PAY_BUTTON_SDK_URL;
      script.onload = _this.setPaymentsClient;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }, _this.setPaymentsClient = function () {
      _this.setState({
        paymentsClientInitialised: true,
        paymentsClient: new window.google.payments.api.PaymentsClient({ environment: _this.props.development ? 'TEST' : 'PRODUCTION' })
      });
    }, _this.payButtonClickListener = function () {
      var _this$props = _this.props,
          currencyCode = _this$props.currencyCode,
          countryCode = _this$props.countryCode,
          totalPriceStatus = _this$props.totalPriceStatus,
          totalPrice = _this$props.totalPrice,
          displayItems = _this$props.displayItems,
          totalPriceLabel = _this$props.totalPriceLabel,
          checkoutOption = _this$props.checkoutOption,
          merchantInfo = _this$props.merchantInfo,
          baseRequest = _this$props.baseRequest,
          paymentMethodType = _this$props.paymentMethodType,
          allowedAuthMethods = _this$props.allowedAuthMethods,
          allowedCardNetworks = _this$props.allowedCardNetworks,
          tokenizationSpecification = _this$props.tokenizationSpecification;


      var baseCardPaymentMethod = {
        type: paymentMethodType,
        parameters: {
          allowedAuthMethods: allowedAuthMethods,
          allowedCardNetworks: allowedCardNetworks
        },
        tokenizationSpecification: tokenizationSpecification
      };

      var paymentDataRequest = _extends({}, baseRequest, {
        allowedPaymentMethods: [baseCardPaymentMethod],
        transactionInfo: {
          currencyCode: currencyCode,
          countryCode: countryCode,
          totalPriceStatus: totalPriceStatus,
          totalPrice: totalPrice,
          displayItems: displayItems,
          totalPriceLabel: totalPriceLabel,
          checkoutOption: checkoutOption
        },
        merchantInfo: merchantInfo
      });

      _this.state.paymentsClient.loadPaymentData(paymentDataRequest).then(function (paymentData) {
        // if using gateway tokenization, pass this token without modification
        var paymentToken = paymentData.paymentMethodData.tokenizationData.token;
        console.log('GPayButton.payButtonClickListener -> paymentToken', paymentToken);
        // TODO pass the paymentToken variable to the parent component using a required prop callback function
      }).catch(function (error) {
        console.error('GPayButton.payButtonClickListener -> error', error);
      });
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(GPayButton, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.state.paymentsClientInitialised) {
        this.loadSDK();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var _this2 = this;

      var _state = this.state,
          isReadyToPay = _state.isReadyToPay,
          paymentsClientInitialised = _state.paymentsClientInitialised,
          paymentsClient = _state.paymentsClient;


      if (isReadyToPay || !paymentsClientInitialised) {
        return;
      }

      var _props = this.props,
          paymentMethodType = _props.paymentMethodType,
          allowedAuthMethods = _props.allowedAuthMethods,
          allowedCardNetworks = _props.allowedCardNetworks,
          tokenizationSpecification = _props.tokenizationSpecification;

      var baseCardPaymentMethod = {
        type: paymentMethodType,
        parameters: {
          allowedAuthMethods: allowedAuthMethods,
          allowedCardNetworks: allowedCardNetworks
        },
        tokenizationSpecification: tokenizationSpecification
      };

      var isReadyToPayRequest = _extends({}, this.props.baseRequest, {
        allowedPaymentMethods: [baseCardPaymentMethod]
      });

      paymentsClient.isReadyToPay(isReadyToPayRequest).then(function (response) {
        var isReadyToPay = response.result;
        if (isReadyToPay) {
          // * this function is called only to initialise the button styling, the returned button element is NOT used
          paymentsClient.createButton({ onClick: _this2.payButtonClickListener });
          _this2.setState({ isReadyToPay: isReadyToPay });
        }
      }).catch(function (error) {
        console.error('window.configureGPay -> error', error);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          className = _props2.className,
          style = _props2.style,
          color = _props2.color,
          buttonType = _props2.buttonType;


      return React.createElement(
        'div',
        { className: className, style: style },
        this.state.isReadyToPay && React.createElement('button', {
          onClick: this.payButtonClickListener,
          type: 'button',
          'aria-label': 'Google Pay',
          className: 'gpay-button ' + color + ' ' + buttonType
        })
      );
    }
  }]);
  return GPayButton;
}(PureComponent);

GPayButton.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  color: PropTypes.oneOf(['black', 'white']),
  buttonType: PropTypes.oneOf(['long', 'short']),
  development: PropTypes.bool,
  // * Google Pay API
  currencyCode: PropTypes.string.isRequired,
  countryCode: PropTypes.string,
  totalPriceStatus: PropTypes.string.isRequired,
  totalPrice: function totalPrice(props, propName, componentName) {
    if (props.totalPriceStatus !== 'NOT_CURRENTLY_KNOWN') {
      if (props[propName] === undefined || props[propName] === '') {
        return new Error(componentName + ': the prop totalPrice is required unless the prop totalPriceStatus is set to NOT_CURRENTLY_KNOWN');
      } else if (!/^[0-9]+(\.[0-9][0-9])?$/.exec(props[propName])) {
        return new Error(componentName + ': the prop totalPrice should be either in a number format or a string of numbers. Should match ^[0-9]+(\\.[0-9][0-9])?$');
      }
    }
  },
  displayItems: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['LINE_ITEM', 'SUBTOTAL']),
    price: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['FINAL', 'PENDING'])
  })),
  totalPriceLabel: PropTypes.string,
  checkoutOption: PropTypes.string,
  merchantInfo: function merchantInfo(props, propName, componentName) {
    if (props.development === false && (props[propName].merchantId === undefined || props[propName].merchantId === '')) {
      return new Error(componentName + ': merchantInfo -> merchantId is required in production environment!');
    } else {
      var merchantInfoProps = props[propName];
      // merchantName, merchantOrigin
      for (var prop in merchantInfoProps) {
        if (typeof merchantInfoProps[prop] !== 'string') {
          return new Error(componentName + ': merchantInfo -> ' + prop + ' should be a string!');
        }
      }
    }
  },
  baseRequest: PropTypes.shape({
    apiVersion: PropTypes.number,
    apiVersionMinor: PropTypes.number
  }),
  tokenizationSpecification: PropTypes.shape({
    type: PropTypes.oneOf(['PAYMENT_GATEWAY', 'DIRECT']).isRequired,
    parameters: PropTypes.oneOfType([PropTypes.shape({
      gateway: PropTypes.string.isRequired,
      gatewayMerchantId: PropTypes.string.isRequired
    }), PropTypes.shape({
      protocolVersion: PropTypes.string.isRequired,
      publicKey: PropTypes.string.isRequired
    })]).isRequired
  }).isRequired,
  allowedCardNetworks: PropTypes.arrayOf(PropTypes.oneOf(['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'])),
  allowedAuthMethods: PropTypes.arrayOf(PropTypes.oneOf(['PAN_ONLY', 'CRYPTOGRAM_3DS'])),
  // ? Paypal support
  purchase_context: PropTypes.shape({
    purchase_units: PropTypes.array
  }),
  paymentMethodType: PropTypes.oneOf(['CARD', 'PAYPAL']).isRequired
};
GPayButton.defaultProps = {
  development: false,
  baseRequest: {
    apiVersion: 2,
    apiVersionMinor: 0
  },
  allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
  allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
  paymentMethodType: 'CARD',
  color: 'black',
  buttonType: 'long'
};

export default GPayButton;
//# sourceMappingURL=index.es.js.map
