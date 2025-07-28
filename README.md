# ColinTvii - Japanese IPTV Player

A beautiful, modern IPTV player specifically designed for Japanese channels with EPG support, built with Electron and React.

![ColinTvii Logo](assets/logo.png)

## Features

### 🎯 Core Features
- **Japanese Channel Support**: Optimized for Japanese IPTV streams
- **EPG Guide**: Full electronic program guide with schedule information
- **Favorites System**: Save and organize your favorite channels
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Cross-Platform**: Works on Windows, macOS, and Linux

### 📺 Player Features
- **HLS Support**: Native HLS (HTTP Live Streaming) playback
- **Fullscreen Mode**: Immersive viewing experience
- **Volume Control**: Precise volume adjustment with visual slider
- **Channel Search**: Quick search through channel listings
- **Channel Groups**: Organized channel categories (Tokyo, Kansai, BS, CS, etc.)

### 🎨 Design Features
- **Glossy Blue Theme**: Inspired by modern Japanese design aesthetics
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: Polished user experience with CSS transitions
- **Dark/Light Themes**: Multiple theme options
- **Custom Logo**: Beautiful "ColinTvii" branding

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ColinTvii
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development mode**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run dist
   ```

## Configuration

### Default Settings
The app comes pre-configured with:
- **M3U Playlist**: Japanese channels from the provided GitHub repository
- **EPG Source**: XMLTV data from the specified EPG service
- **Theme**: Dark theme with blue accent colors

### Customization
You can customize the app through the Settings panel:
- Change M3U playlist URL
- Update EPG source
- Modify theme preferences
- Adjust player settings

## Usage

### Basic Navigation
1. **Channels Tab**: Browse all available channels organized by groups
2. **EPG Guide**: View program schedules and current shows
3. **Favorites**: Access your saved favorite channels
4. **Settings**: Configure the application preferences

### Playing Channels
1. Click on any channel in the sidebar or main grid
2. The video player will open in a modal window
3. Use the controls to adjust volume, toggle fullscreen, or close the player

### Managing Favorites
1. Click the heart icon on any channel to add/remove from favorites
2. Access favorites through the dedicated Favorites tab
3. Favorites are automatically saved and persist between sessions

## Technical Details

### Built With
- **Electron**: Cross-platform desktop application framework
- **React**: Modern JavaScript library for building user interfaces
- **Video.js**: HTML5 video player with HLS support
- **Moment.js**: Date and time manipulation library
- **Lucide React**: Beautiful icon library

### Architecture
- **Context API**: State management for channels and EPG data
- **Component-based**: Modular, reusable components
- **Responsive Design**: Mobile-friendly layouts
- **Modern CSS**: Flexbox, Grid, and CSS animations

### File Structure
```
ColinTvii/
├── src/
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── styles.css      # Main stylesheet
│   ├── App.js          # Main application component
│   └── index.js        # Application entry point
├── main.js             # Electron main process
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
└── webpack.config.js   # Webpack configuration
```

## Features in Detail

### EPG (Electronic Program Guide)
- Real-time program schedule display
- Current and upcoming show information
- Program descriptions and categories
- Date navigation (previous/next day)
- Live indicator for currently airing shows

### Channel Management
- Automatic channel grouping by category
- Search functionality across all channels
- Channel logos and metadata display
- Favorites system with persistent storage
- Channel status indicators

### Video Player
- HLS stream support for Japanese channels
- Custom video controls with volume slider
- Fullscreen mode support
- Auto-play and resume functionality
- Error handling and retry mechanisms

## Troubleshooting

### Common Issues

**Channels not loading:**
- Check your internet connection
- Verify the M3U playlist URL is accessible
- Try refreshing the application

**EPG data not showing:**
- Ensure the EPG URL is correct and accessible
- Check if the EPG service is available
- Try switching to a different EPG source

**Video playback issues:**
- Verify the stream URL is valid
- Check if the stream format is supported (HLS)
- Ensure sufficient bandwidth for streaming

### Performance Tips
- Close unnecessary applications while streaming
- Use a wired internet connection for better stability
- Keep the application updated to the latest version

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Japanese IPTV playlist provided by the community
- EPG data from various XMLTV sources
- Icons from Lucide React
- Design inspiration from modern Japanese UI/UX

## Support

For support, please open an issue on GitHub or contact the development team.

---

**ColinTvii** - Bringing Japanese television to your desktop with style and functionality. 