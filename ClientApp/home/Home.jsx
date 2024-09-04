import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PhotoFrame from '../photos/PhotoFrame';
import epostJpg from '../../wwwroot/images/mail.png';
import { Animate, AnimateKeyframes } from "react-simple-animate";

const Home = () => {
  const [isClient, setIsClient] = useState(false);
  const [play, setPlay] = useState(false);
  const [rand] = useState(Math.floor(Math.random() * 10000));

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');

    if (isClient) {
      setPlay(true);

      // Load the weather widget script
      const script = document.createElement('script');
      script.src = 'https://weatherwidget.io/js/widget.min.js';
      script.async = true;
      document.body.appendChild(script);
    }

  }, [isClient]);

  const props = {
    startStyle: { opacity: 0 },
    endStyle: { opacity: 1 }
  };

  const animatedImage = isClient ? (
    <Animate play={play} durationSeconds={3} {...props}>
      <AnimateKeyframes
        play={play}
        iterationCount={10}
        durationSeconds={0.2}
        keyframes={[
          "transform: rotate(0)",
          "transform: rotate(360deg)"
        ]}
      >
        <AnimateKeyframes
          play={play}
          iterationCount="1"
          direction="alternate"
          durationSeconds={2}
          keyframes={[
            'transform: scaleX(0.05) scaleY(0.05)',
            'transform: scaleX(0.1) scaleY(0.1)',
            'transform: scaleX(0.15) scaleY(0.15)',
            'transform: scaleX(0.2) scaleY(0.2)',
            'transform: scaleX(0.25) scaleY(0.25)',
            'transform: scaleX(0.3) scaleY(0.3)',
            'transform: scaleX(0.35) scaleY(0.35)',
            'transform: scaleX(0.4) scaleY(0.4)',
            'transform: scaleX(0.45) scaleY(0.45)',
            'transform: scaleX(0.5) scaleY(0.5)',
            'transform: scaleX(0.55) scaleY(0.55)',
            'transform: scaleX(0.6) scaleY(0.6)',
            'transform: scaleX(0.65) scaleY(0.65)',
            'transform: scaleX(0.7) scaleY(0.7)',
            'transform: scaleX(0.75) scaleY(0.75)',
            'transform: scaleX(0.8) scaleY(0.8)',
            'transform: scaleX(0.85) scaleY(0.85)',
            'transform: scaleX(0.9) scaleY(0.9)',
            'transform: scaleX(1) scaleY(1)'
          ]}
        >
          <PhotoFrame>
            <Link to={`/details/0/0/-?${rand}`}>
              <img onLoad={() => setPlay(true)} src={`/Handler/Index/PhotoID=0/Size=M?${rand}`} alt="" style={{ border: "4px solid white", maxHeight: "100%", maxWidth: "100%", verticalAlign: "middle" }} />
            </Link>
          </PhotoFrame>
        </AnimateKeyframes>
      </AnimateKeyframes>
    </Animate>
  ) : (
    <PhotoFrame hidden>
      <Link to="/">
        <img src={''} alt="" style={{ border: "4px solid white", maxHeight: "100%", maxWidth: "100%", verticalAlign: "middle" }} />
      </Link>
    </PhotoFrame>
  );

  return (
    <div className="container">
      <div className="row">
        <div className="row-height">
          <div className=" col-md-3 hidden-md hidden-sm hidden-xs col-md-height col-md-top custom-vertical-left-border custom-vertical-right-border grey-background">
            <div className="row">
              <div className="col-md-12">
                <h4 />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-primary center-block">
                  <div className="panel-heading text-center">
                    <h3 className="panel-title">Today's photo</h3>
                  </div>
                  <div className="panel-body">
                    <div className="row text-center">
                      <div className="col-md-12" id="divSwirl">
                        {animatedImage}
                      </div>
                    </div>
                    <div className="row text-center">
                      <hr />
                      <div id="divText" style={{ minHeight: '60px' }}>Photos</div>
                      <div id="divDownload" style={{ minHeight: '50px' }}>
                        <p>
                          <a href="/Handler/Download/0/M">
                            <img src="./images/button-download.gif" alt="download photo" />
                          </a>
                        </p>
                        <hr />
                        <p>
                          See <Link to="/albums">more photos</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="divContact" style={{ minHeight: '90px' }}>
                  <Animate play={play} durationSeconds={3} {...props} delaySeconds={1}>
                    <h4>Contact information</h4>
                    <p>
                      &nbsp;&nbsp;<span className="glyphicon glyphicon-phone-alt" style={{ color: "gray" }} />&nbsp;010-123 456
                    </p>
                    <p>
                      <img src={epostJpg} alt="epost" className="img-responsive" />
                    </p>
                  </Animate>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="panel panel-primary">
                      <div className="panel-heading">
                        <h3 className="panel-title text-center">Today's weather</h3>
                      </div>
                      <div className="panel-body panel-height_small">
                        <div id="divWeather" style={{ verticalAlign: "textTop" }}>
                          <Animate play={play} durationSeconds={3} delaySeconds={2.1} {...props}>
                            <a className="weatherwidget-io"
                              href="https://forecast7.com/en/40d71n74d01/new-york/"
                              data-label_1="NEW YORK"
                              data-label_2="WEATHER"
                              data-theme="original">
                              NEW YORK WEATHER
                            </a>
                          </Animate>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-9 col-md-height">
            <div className="row">
              <div className="col-md-12">
                <h4 />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h3 className="panel-title">Panel 1</h3>
                  </div>
                  <div className="panel-body">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas euismod orci velit, id tincidunt massa mollis ac. Aliquam volutpat facilisis lacinia. Aenean auctor justo non faucibus efficitur. Sed mollis, orci faucibus suscipit pellentesque, nunc augue blandit ante, eget gravida ex erat sed lectus. Mauris eu congue lacus, gravida aliquam ligula. Aenean in diam eget mi tincidunt iaculis. Sed ac mi velit. Nam vestibulum, metus id auctor bibendum, purus mi congue urna, vitae maximus nibh orci eu orci.

                    Donec viverra nisl diam, pellentesque tincidunt risus hendrerit nec. Nulla at magna dui. Mauris nec tristique enim. Ut a feugiat odio. Nullam efficitur bibendum lorem. Curabitur pharetra risus neque, a molestie quam ultrices at. Etiam molestie libero odio. Suspendisse volutpat, justo vitae varius facilisis, quam ex placerat orci, sit amet cursus ante mi et purus. Vivamus dolor sem, suscipit ut nisl id, malesuada commodo metus. Ut at orci non arcu ornare fringilla pharetra non nunc. Suspendisse arcu odio, commodo nec porta et, viverra et arcu. Nullam nec lacinia velit. Pellentesque commodo fringilla est, sed ullamcorper risus vestibulum vitae. Nunc facilisis, eros vitae rhoncus consectetur, velit magna interdum felis, quis convallis arcu nisl a lorem. Proin gravida, elit non volutpat maximus, urna purus commodo ante, quis viverra lectus urna eget nisi.
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h3 className="panel-title">Panel 2</h3>
                  </div>
                  <div className="panel-body">
                    Phasellus diam dolor, molestie quis arcu nec, fermentum lobortis ante. Nunc sagittis condimentum felis sit amet ultrices. Donec aliquam dolor sit amet tempor elementum. Proin auctor justo mi, quis consectetur tortor molestie at. Sed aliquet odio turpis, at efficitur justo egestas quis. Duis facilisis dui arcu, sit amet ullamcorper lacus tristique id. Donec euismod arcu urna, sed pellentesque nibh ornare et.

                    Duis sed imperdiet neque. Morbi fermentum scelerisque quam non luctus. Vestibulum vehicula sollicitudin nibh, quis hendrerit massa ullamcorper a. Quisque posuere euismod elit, nec rutrum tellus pellentesque in. Nulla facilisi. Donec fringilla, neque ac vulputate rutrum, nisl tortor facilisis urna, ac cursus urna nibh vitae odio. Nunc lorem dui, consequat nec ex eget, lobortis pharetra nibh. Nunc pretium odio nisl, vel gravida urna tristique at. Mauris ut nibh quis lorem vulputate ullamcorper. Quisque condimentum purus vitae massa porttitor, in feugiat elit blandit. Praesent lectus tortor, molestie nec libero vitae, aliquam aliquam sapien.

                    Quisque blandit iaculis mauris eu feugiat. Aenean eget diam quis elit pretium vestibulum. Donec velit sapien, commodo eu posuere et, commodo sit amet purus. Aliquam erat volutpat. Maecenas non hendrerit ligula, quis feugiat risus. Morbi et efficitur mauris. Curabitur ut bibendum elit. Pellentesque sit amet cursus nunc. Donec rhoncus et dui at tempus. Vestibulum et nibh pulvinar nibh bibendum bibendum non finibus velit. Maecenas non odio ultrices, dignissim odio id, ullamcorper tortor. Curabitur lacinia arcu et malesuada sollicitudin. Integer sed cursus felis. Aenean porta, tortor vel aliquet tempor, neque lectus euismod dolor, non dapibus ligula nisl ut nisl.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
