import {
  default as React,
  Component,
  PropTypes,
} from "react";

import {
  default as warning,
} from "warning";

import {
  default as makeAsyncScript,
} from "react-async-script";

import {
  GoogleMap,
} from "../index";

import {
  default as makeUrl,
} from "../utils/makeUrl";

function createWrapperComponent (props) {
  const {callbackName, globalName, ...urlObj} = props;

  return makeAsyncScript(React.createClass({
    render () {
      if ("undefined" === typeof google || "undefined" === typeof google.maps || "undefined" === typeof google.maps.Map) {
        return null;
      } else {
        return (
          <GoogleMap {...this.props} />
        );
      }
    }
  }), makeUrl(urlObj), {
    callbackName,
    globalName,
  });
}

export default class ReactAsyncScriptGoogleMap extends Component {
  static propTypes = {
    // PropTypes for URL generation
    // https://nodejs.org/api/url.html#url_url_format_urlobj
    protocol: PropTypes.string,
    hostname: PropTypes.string.isRequired,
    port: PropTypes.number,
    pathname: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired,
    // PropTypes pass to "react-async-script"
    callbackName: PropTypes.string,
    globalName: PropTypes.string,
  }

  state = {
    wrapperComponent: createWrapperComponent(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const changedKeys = Object.keys(ReactAsyncScriptGoogleMap.propTypes)
      .filter(key => this.props[key] !== nextProps[key]);

    warning(0 === changedKeys.length, `ReactAsyncScriptGoogleMap doesn't support mutating props after initial render. Changed props: %s`, `[${ changedKeys.join(", ") }]`);
  }

  render () {
    const {protocol, hostname, port, pathname, query, callbackName, globalName, ...restProps} = this.props;
    const {wrapperComponent: WrapperComponent} = this.state;

    return (
      <WrapperComponent {...restProps} />
    );
  }
}
