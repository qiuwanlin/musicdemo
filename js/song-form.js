{
    let view = {
        el: '.page > main',
        template: `
            <form action="">
                    <div class="songEditTitle">编辑歌曲信息</div>
                    <div class="row">
                        <label for="">歌名:
                        <input name="name" type="text" >
                        </label>
                    </div>
                    <div class="row">
                        <label for="">歌手:
                        <input name="singer" type="text">
                        </label>
                    </div>
                    <div class="row">
                        <label for="">外链:
                        <input name="url" type="text" >
                        </label>
                    </div>
                    <div class="row">
                        <button type="submit">保存</button>
                    </div>
                </form>`,
        render(data) {
            $(this.el).html(this.template)
        },
        init() {
            this.$el = $(this.el)
        }
    }
    let moudle = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: '',
        },
        creat(data) {
            var TestObject = AV.Object.extend('song');
            var Song = new TestObject();
            Song.set('name', data.name);
            Song.set('singer', data.singer);
            Song.set('url', data.url);

            return Song.save().then((song) => {
                let { id, attributes } = song
                Object.assign(this.data, { id, ...attributes })
            });
        }
    }
    let controller = {
        init(view, moudle) {
            this.view = view
            this.view.init()
            this.moudle = moudle
            this.view.render(this.moudle.data)
            this.bindEvent()
        },
        bindEvent() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string) => {
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.moudle.creat(data)
                .then(() => {
                    console.log(this.model.data)
                    
                })

            })
        }
    }
    controller.init(view, moudle)
}