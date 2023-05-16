# Spicetify DJ Info

Welcome to the Spicetify DJ Info Extension! This extension enhances your Spicetify experience by providing valuable song analysis data for each track, including Key (Camelot System), BPM, Energy, and Popularity. With this extension, you can gain deeper insights into your music library and discover songs perfectly fitting into your DJ set.

## ⭐Features

- **Key (Camelot System):** Identify the key of each song in the Camelot system. The Camelot system simplifies harmonic mixing by categorizing keys into groups that are harmonically compatible. This enables smoother transitions between songs during DJ sets or when creating cohesive playlists.
- **BPM ♫ (Beats Per Minute):** Get the tempo of each song, which indicates the speed or pace at which the music is played. BPM is useful for creating playlists with similar speed or for selecting songs for specific activities.
- **Energy E:** Explore the energy level of your songs. This metric represents the intensity and activity in a track, allowing you to find tracks with high energy for workouts or energetic playlists.
- **Popularity ♥:** Discover how popular your songs are by accessing their popularity ratings. This data can be helpful in understanding the overall reception and popularity of a track.
----

May cause issues with Star Ratings!

----
![Screenshot](img/playlist.png)
![Screenshot](img/now-playing.png)

## 💻 Installation

Copy `djinfo.js` into your [Spicetify](https://github.com/spicetify/spicetify-cli) extensions directory:
| **Platform** | **Path**                                                                             |
| ------------ | ------------------------------------------------------------------------------------ |
| **Linux**    | `~/.config/spicetify/Extensions` or `$XDG_CONFIG_HOME/.config/spicetify/Extensions/` |
| **MacOS**    | `~/.config/spicetify/Extensions` or `$SPICETIFY_CONFIG/Extensions`                   |
| **Windows**  | `%appdata%/spicetify/Extensions/`                                                    |

After putting the extension file into the correct folder, run the following command to install the extension:
```
spicetify config extensions djinfo.js
spicetify apply
```

Or you can manually edit your `config-xpui.ini` file. Add your desired extension filenames in the extensions key, separated them by the | character.
Example:

```ini
[AdditionalOptions]
...
extensions = autoSkipExplicit.js|shuffle+.js|trashbin.js|djinfo.js
```

Then run:

```
spicetify apply
```

## ❌ Uninstallation

Run the following command to uninstall the extension (note the - on the end):
```
spicetify config extensions djinfo.js-
spicetify apply
```

You can also manually edit your `config-xpui.ini` file. Just remove the extensions' filename completely.
Example:

```ini
[AdditionalOptions]
...
extensions = autoSkipExplicit.js|shuffle+.js|trashbin.js
```

Then run:

```
spicetify apply
```

## ⚙️ Settings

You have the option to toggle the visibility of DJ information in the extension. By default, DJ information such as Key, BPM, Energy and Popularity are displayed for each song and also next to the currently playing song. However, if you prefer a cleaner interface, you can easily hide these seperately.

To toggle the visibility of DJ information, follow these steps:

1. Open Spotify
2. Locate the menu icon on the top-right corner of the interface (your profile picture) and click on the icon.
3. In the menu, find the option 'DJ Info'.
4. In the sub-menu click on the toggle switch to hide or show the DJ information for either playlists or now playing.
5. Wait for the reload

## 🌐 Credits

Big thanks to [duffey](https://github.com/Tetrax-10) for the main code of displaying something in the playlist and the now playing bar!

## 💬 Feedback and Contributions

If you encounter any issues or have suggestions for improving this extension, feel free to open an issue in the [GitHub repository](https://github.com/L3-N0X/spicetify-dj-info). Contributions are also welcome! Fork the repository, make your changes, and submit a pull request with your improvements.

## ⚖️ License

This project is licensed under the [MIT License](LICENSE.md). Feel free to use, modify, and distribute the code as per the terms of this license.

---

Enjoy the enhanced music analysis experience with the Spicetify DJ Info Extension! If you find this extension useful, consider giving it a ⭐️ on GitHub. Thank you for using DJ Info!