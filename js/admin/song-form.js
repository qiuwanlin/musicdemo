{
    let view = {
        el: '.page > main',
        template: `
            <form class="form">
                    <div class="row">
                        <label>歌名:</label>
                        <input name="name" type="text" value="__name__">
                        
                    </div>
                    <div class="row">
                        <label>歌手:</label>
                        <input name="singer" type="text" value="__singer__">
                        
                    </div>
                    <div class="row">
                        <label>外链:
                        <input name="url" type="text" value="__url__">
                        </label>
                    </div>
                    <div class="row">
                        <label>封面:
                        <input name="cover" type="text" value="__cover__">
                        </label>
                    </div>
                    <div class="row">
                        <label>歌词:
                        </label>
                        <textarea cols=40 rows=20 name="lyrics">__lyrics__</textarea>
                    </div>
                    <div class="row">
                        <button type="submit">保存</button>
                    </div>
                </form>`,
        render(data = {}) {
            let ppp = ['name', 'url', 'singer', 'id', 'cover','lyrics']
            let html = this.template
            ppp.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if (data.id) {
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            } else {
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        init() {
            this.$el = $(this.el)
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '', singer: '', url: '', id: '', cover:'',lyrics:''
        },
        updata(data){
            var s = AV.Object.createWithoutData('song', this.data.id)
            s.set('name', data.name)
            s.set('singer', data.singer)
            s.set('url', data.url)
            s.set('cover', data.cover)
            s.set('lyrics', data.lyrics)
            return s.save().then((response)=>{
                Object.assign(this.data,data)
                return response
            })
        },
        create(data) {
            var TestObject = AV.Object.extend('song');
            var Song = new TestObject();
            Song.set('name', data.name);
            Song.set('singer', data.singer);
            Song.set('url', data.url);
            Song.set('cover', data.cover);
            Song.set('lyrics', data.lyrics)

            return Song.save().then((song) => {
                let { id, attributes } = song
                Object.assign(this.data, { id, ...attributes })
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvent()
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data) => {
                data = data || {
                    name: '', singer: '', url: '', id: '',cover:'',lyrics:''
                }
                this.model.data = data
                this.view.render(this.model.data)
            })
        },
        create() {
            let needs = 'name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data).then(() => {
                this.view.reset()
                let data = JSON.stringify(this.model.data)
                window.eventHub.emit('create', JSON.parse(data))
            })
        },
        update() {
            let needs = 'name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.updata(data).then(()=>{
                alert('修改成功')
                window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
            })
        },
        bindEvent() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                if (this.model.data.id) {
                    this.update()
                } else {
                    this.create()
                }
                return
            })
        }
    }
    controller.init(view, model)
}