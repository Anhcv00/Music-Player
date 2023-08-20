const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextSong = $('.btn-next')
const prevSong = $('.btn-prev')
const random = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Hay Trao Cho Anh',
            singer: 'Son Tung MTP',
            path: './assets/music/HayTraoChoAnh.mp3',
            image: './assets/img_music/HTCA.jpg'
        },
        {
            name: 'Giac mo trua',
            singer: 'Thuy chi',
            path: './assets/music/GiacMoTrua.mp3',
            image: './assets/img_music/GMT.jpg'
        },
        {
            name: 'Con Duong Hanh Phuc',
            singer: 'Thuy chi',
            path: './assets/music/ConDuongHanhPhuc.mp3',
            image: './assets/img_music/CDHP.jpg'
        },
        {
            name: 'Yeu Duong Kho Qua Thi Chay Ve Khoc Voi Anh',
            singer: 'ERIK',
            path: './assets/music/YeuDuongKhoQuaThiChayVeKhocVoiAnh.mp3',
            image: './assets/img_music/ERIK.jpg'
        },
        {
            name: 'THUC GIAC',
            singer: 'DA LAB',
            path: './assets/music/ThucGiac.mp3',
            image: './assets/img_music/DALAB.jpg'
        },
        {
            name: 'HOA TAN TINH TAN',
            singer: 'Giang Jolee',
            path: './assets/music/HoaTanTinhTan.mp3',
            image: './assets/img_music/HTTT.jpg'
        },
        {
            name: 'DE VUONG',
            singer: 'DINH DUNG',
            path: './assets/music/DeVuong.mp3',
            image: './assets/img_music/DEVUONG.jpg'
        }
    ] ,
    render: function() {
        const htmls = this.songs.map(function(song, index) {
            return `
        <div class="song ${index === app.currentIndex ? 'active' : '' }" data-index = "${index}">
            <div class="thumb" 
            style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        })
    
        $('.playlist').innerHTML = htmls.join('')
        
    },
    defineProperty: function(){
        Object.defineProperty(this, 'currentSong',{
            
            get: function(){
                return this.songs[this.currentIndex]
            }
            
        })
    },
    handleEvents: function() {
        const _this = this;
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth
        // xử lý CD quay / dừng
        const cdThumbAnimated = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],
            {
                duration: 10000, // tốc độ quay 1 vòng
                iterations: Infinity
            }
        )
        cdThumbAnimated.pause()
        // xử lý phóng to thu nhỏ của cd
        document.onscroll = function() {
            const scroll = document.documentElement.scrollTop || window.scrollY
            const newScroll = cdWidth - scroll
            
            cd.style.width = newScroll > 0 ? newScroll + 'px' : 0
            cd.style.opacity = newScroll / cdWidth
        }

        // xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            } else {
                audio.play()
            }
        }
        // khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimated.play()
        }
        // khi song pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimated.pause()
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // Khi tua song
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }   
        // khi nextSong
        nextSong.onclick = function(){
            if(_this.isRandom){
                _this.randomSong() // khi bật random song
            }else{
                _this.nextSong();
            }
            audio.play()
            _this.render()
            _this.scrollToActive()
        }
        // khi prev song
        prevSong.onclick = function(){
            if(_this.isRandom){
                _this.randomSong() // khi bật random song
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActive()
        }
        // bat ngau nhien
        random.onclick = function(){
            _this.isRandom = !_this.isRandom
            random.classList.toggle('active', _this.isRandom)
        }
        // repeat 1 bai
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            } else {
                nextSong.click()
            }
        }
        // click de active
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if( songNode || !e.target.closest('.option')){
                if(songNode){
                    console.log(songNode.dataset.index)
                    _this.currentIndex = Number(songNode.dataset.index) // doi chuoi thanh so
                    _this.render()
                    _this.loadCurrentSong()
                    audio.play()
                }
                if(e.target.closest('.option')){
                    audio.pause()
                }
            }
        }
    },
    scrollToActive: function(){
            setTimeout(function() {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            },100)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0 
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        console.log(this.songs.length)
        this.currentIndex--
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while( newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function(){
        // Định nghĩa các thuộc tính cho object
        this.defineProperty ()

        // Xử lý lắng nghe các sự kiện trong Dom
        this.handleEvents()

        // load ra các bài hát hiện tại
        this.loadCurrentSong()

        // Lấy ra playlist
        this.render()
    }
}

app.start()


