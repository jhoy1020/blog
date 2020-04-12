import React from 'react';
import jhoy from './images/jhoy.jpeg';
import './styles/styles.css';

/**
 * The about page.
 */
const AboutPage = (): JSX.Element => {
  return (
    <div className='about-container'>
      <img
        alt='jhoy'
        className='about-profile-image'
        height='auto'
        src={jhoy}
        width={250}
      />
      <h1>Welcome!</h1>
      <p className='about-profile-text'>
        Hello and welcome to my site. My name is Josh Hoy and you are probably
        asking yourself, who is this person and why does he think he is
        important enough to have a blog? That is a really good question. Long
        story short, I dont. I am a simple software engineer from Johnstown,
        Pennsylvania, who after taking a programming class in 8th grade,
        discovered something they really enjoyed doing.
      </p>
      <p className='about-profile-text'>
        I currently live in State College, Pennsylvania, with my amazing wife,
        Melissa, a rambunctious Rhodesian Ridgeback, Aela, and our angry, fluffy
        lionhead rabbit, Ada. When I am not coding, I enjoy running with my pup,
        going on camping trips, reading fantasy/sci-fi books, and trying to
        perfect my homebrewing skills to make the perfect beer (unsuccessfully,
        I may add). When it comes to reading, I enjoy fantasy and sci-fi books,
        especially those written by Brandon Sanderson and classics like
        Starshiptroopers, Enders Game, and The Forever War.
      </p>
      <p className='about-profile-text'>
        After graduating from the University of Pittsburgh at Johnstown with my
        Bachelor of Science degree in computer science (2008), I worked for a
        variety of companies ranging in a variety of industries and roles. I
        have worked on backend services, desktop applications, web apps, and
        tooling/infrastructure. One topic that I am very passionate about is
        "how to ship software the fastest way possible with high quality." I
        have worked on a number of services where I was successfully able to get
        it shipping on a daily cadence. I find these problems challenging and
        rewarding. It usually just comes down to streamlining processes. Who
        doesn't love that?
      </p>
      <p className='about-profile-text'>
        A few months ago, my current company hosted an onsite React training. I
        enjoyed it so much, I decided to continue to expand on what I learned.
        While trying to develop this blog, I scoured blogs, tutorials, and
        articles to piece this together. In doing so I noticed how all the
        resources I found, only had bits and pieces of what I needed. I could
        never find exactly what I needed. I love mentoring and sharing knowledge
        with the people around me. I have been fortunate to work with people who
        have challenged me to become a stronger engineer and I try to do the
        same. Therefore, I decided to share all of the code I have written and
        write posts that explain what I did and why. My goal with this blog is
        to help other developers to have a place to start or have a place for
        react/javascript gurus to leave helpful comments and suggestions. To me,
        sharing is caring :)!
      </p>
      <p className='about-profile-text'>
        To give you a sneak peek, this site was created using Typescript, React,
        Node.js, Express, TypeORM, and Postgres. It integrates with Github
        Oauth, Google Captcha, Docker, and numerous Aws services. I am not
        advocating any of these technologies, I just wanted to experiment with
        them.
      </p>
    </div>
  );
};

export default AboutPage;
