import * as React from 'react';
import {animated, useSpring, useTransition} from "react-spring";

import {BT} from "../../data/const";

export const ImageGroup = (data: {image: any, backgroundType: string, backgroundColor: string,
  horizTransLevel: number, vertTransLevel: number, zoomStart: number, zoomEnd: number,
  transDuration: number, fadeDuration: number, crossFade: boolean}) => {
  const fadeTransitions: [{item: any, props: any, key: any}] = useTransition(
    data.image,
    (image: any) => {
      return image.key
    },
    {
      initial: { // Initial (first time) base values, optional (can be null)
        opacity: 1,
      },
      from: { // Base values, optional
        opacity: data.crossFade ? 0 : 1,
      },
      enter: { // Styles apply for entering elements
        opacity: 1,
      },
      leave: { // Styles apply for leaving elements
        opacity: data.crossFade ? 0 : 1,
      },
      unique: true, // If this is true, items going in and out with the same key will be re-used
      config: {
        duration: data.fadeDuration,
      },
    }
  );

  return (
    fadeTransitions.map(({item, props, key}) => {

      let backgroundStyle;
      if (data.backgroundType == BT.color) {
        backgroundStyle = {
          height: '100%',
          width: '100%',
          backgroundColor: data.backgroundColor,
          backgroundSize: 'cover',
        };
      } else {
        backgroundStyle = {
          height: '100%',
          width: '100%',
          filter: 'blur(8px)',
          backgroundImage: `url(${item.src})`,
          backgroundSize: 'cover',
        };
      }
      return (
        <animated.div className="ImageView u-fill-container" key={key} style={{ ...props }}>
          <Image src={item.src}
                 horizTransLevel={data.horizTransLevel}
                 vertTransLevel={data.vertTransLevel}
                 zoomStart={data.zoomStart}
                 zoomEnd={data.zoomEnd}
                 duration={data.transDuration} />
          <animated.div
            style={backgroundStyle}
          />
        </animated.div>
      );
    })
  );
};

const Image = (data: {src: string, horizTransLevel: number, vertTransLevel:number,
  zoomStart: number, zoomEnd: number, duration: number }) => {
  const imageProps = useSpring(
    {
      from: {
        transform: 'translate(0%, 0%) scale(' + data.zoomStart + ')',
      },
      to: {
        transform: 'translate(' + data.horizTransLevel + '%, ' + data.vertTransLevel + '%) scale(' + data.zoomEnd + ')',
      },
      config: {
        duration: data.duration,
      },
    }
  );

  const style = {
    height: '100%',
    width: '100%',
    zIndex: 2,
    backgroundImage: `url(${data.src})`,
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    position: 'absolute',
  };

  return <animated.div style={{ ...imageProps, ...style}} />
};

export default class ImageView extends React.Component {
  readonly props: {
    image: HTMLImageElement | HTMLVideoElement,
    backgroundType: string,
    backgroundColor: string,
    horizTransLevel: number,
    vertTransLevel: number,
    zoomStart: number,
    zoomEnd: number,
    transDuration: number,
    crossFade: boolean,
    fadeDuration: number,
  };

  shouldComponentUpdate(props: any): boolean {
    return ((props.image.src !== this.props.image.src) ||
      (props.transDuration !== this.props.transDuration) ||
      (props.fadeDuration !== this.props.fadeDuration));
  }

  render() {
    return (
      <ImageGroup
        image={this.props.image}
        backgroundType={this.props.backgroundType}
        backgroundColor={this.props.backgroundColor}
        horizTransLevel={this.props.horizTransLevel}
        vertTransLevel={this.props.vertTransLevel}
        zoomStart={this.props.zoomStart}
        zoomEnd={this.props.zoomEnd}
        transDuration={parseInt(this.props.transDuration, 10)}
        crossFade={this.props.crossFade}
        fadeDuration={parseInt(this.props.fadeDuration, 10)}/>
    );
  }
}