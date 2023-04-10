
<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/roshray/redlit">
    <img src="frontend/src/assets/logo.png" alt="Logo" width="280" height="80">
  </a>

<h3 align="center">redlit</h3>

  <p align="center">
    A social news aggregation website and discussion portal! 
    <br />
    <a href="https://github.com/roshray/redlit"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://www.youtube.com/watch?v=-1LC_N8UsaM">View Demo</a>
    ·
    <a href="https://github.com/roshray/redlit/issues">Report Bug</a>
    ·
    <a href="https://github.com/roshray/redlit/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

`An attempt to partially build a replica of reddit.`

<details>
    <summary>Architecture in detail's</summary> 
    <ol>
      <h4>Functional Requirement</h4>
        <li>Authentication Modal Login & SignUp</li>
          <li>
            TimeLine<p3>Feed from the People and the community you follow!</p3>
          </li>
        <li>TimeLine</li>
        <li>Create a Post</li>
            <li>Post: Title & Text Bos and submit</li>
            <li>Images & Videos : Upload</li>
            <h4>On hold Features</h4>
            <li> `Link` | `Poll` | `Talk with mic`</li>
    </ol>

`State Management:`

* Local State  : useState()
* Global state : Recoil
* server state : ?
* URL state    : Nextjs [useRouter()]

`Firestore :  a document reference, creating a community`

* `Database`: `users & community`
* `users` can join many community
* `community` can have many users |  `Many to Many relation`
* `Atomic Operations`: Firestore supports atomic ops to read and write data.
  2 types : `Transactional` & `Batched Writes`.

* `Transactional`  : a set of `read` & `write` operations on one or more documents.
* `Batched Writes` : a set of `write` operations on one or more documents.

`Votes on Posts` : The most fun part of this project.
* `UpVote` or `DownVote`
* voting function's : `upvote` ,`downvote` , `removing the Vote (upvote => neutral or downvote => neutral)` and `Flipping the Vote (up => down or down => up)`

<h3>Non-Functional Requirements
  <li>High Availability <p1>  People Feed </p1></li>
  <li>Latency</li>
  <li>Scale</li>
  <li>Fault tolerant</li>
</h3>  

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Nextjs][Next.js]][Next-url]

* [![React][React.js]][React-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Instructions on setting up this project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

How to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a OpenAI API Key at [https://OpenAI.com](https://OpenAI.com)
2. Clone the repo
   ```sh
   git clone https://github.com/roshray/redlit.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your Firebase API in `.env`
   ```
   Firebase_API_KEY = 'ENTER YOUR API'
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Additional screenshots, code examples and demos are shared.

_For more details, please refer to the [Documentation](https://github.com/roshray/)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [X] Authentication as loggedIn & LoggedOut. 
- [X] Create Community,Post.
- [X] Display the Post on the Feed.
    - [X] comment,vote and delete post.

See the [open issues](https://github.com/roshray/redlit/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Roshan Ray - [@rosh_ray_](https://twitter.com/rosh_ray_) - 97rayroshan@gmail.com

Project Link: [https://github.com/roshray/redlit](https://github.com/roshray/redlit)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Youtuber's](https://youtube.com)
* [React](https://react.org/)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/roshray/redlit.svg?style=for-the-badge
[contributors-url]: https://github.com/roshray/redlit/commits/
[forks-shield]: https://img.shields.io/github/forks/roshray/redlit.svg?style=for-the-badge
[forks-url]: https://github.com/roshray/redlit/network/members
[stars-shield]: https://img.shields.io/github/stars/roshray/redlit.svg?style=for-the-badge
[stars-url]: https://github.com/roshray/redlit/stargazers
[issues-shield]: https://img.shields.io/github/issues/roshray/redlit.svg?style=for-the-badge
[issues-url]: https://github.com/roshray/redlit/issues
[license-shield]: https://img.shields.io/github/license/roshray/redlit.svg?style=for-the-badge
[license-url]: https://github.com/roshray/redlit/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/roshanray/
[product-screenshot]: https://github.com/roshray/redlit/blob/main/redlit.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/



