{
    let view = {
        el: '.newSong',
        template: `新建歌曲`,
        render(data) {
            return $(this.el).html(this.template)
        }
    }
    let moudle = {}
    let controller = {
        init(view, moudle) {
            this.view = view
            this.moudle = moudle
            this.view.render(this.moudle.data)
        }
    }
    controller.init(view, moudle)
} 