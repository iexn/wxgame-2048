Page({

    data: {
        action: false,
        items: [],
        stepNumber: [2,2,2,4],
        pause: false,
        ctx: false,
        startCoordinates: [],
        endCoordinates: [],
        lastActionTimeStamp: 0,
        direction: false
    },

    onLoad: function() {

        var ctx = wx.createCanvasContext("wxgame")

        this.setData({
            ctx: ctx
        })

        this.addItem()
        this.addItem()

        this.animation()

    },

    // 开始事件
    touchStart: function(event) {
        if(this.data.pause) {
            return false
        }
        this.setData({
            startActionTimeStamp: event.timeStamp,
            startCoordinates: {
                x: event.touches[0].x,
                y: event.touches[0].y
            },
            endCoordinates: {
                x: event.touches[0].x,
                y: event.touches[0].y
            }
        })

    },

    // 检测滑动方向
    touchMove: function(event) {
        if(this.data.pause) {
            return false
        }
        this.setData({
            lastActionTimeStamp: event.timeStamp,
            endCoordinates: {
                x: event.touches[0].x,
                y: event.touches[0].y
            }
        })
        // console.log(event)
    },

    // 真正执行步骤
    touchEnd: function(event) {
        if(this.data.pause) {
            console.log("pause")
            return false
        }
        // 单次操作时间过长，操作取消
        if(event.timeStamp - this.data.lastActionTimeStamp > 2000) {
            console.log("touce time out")
            return false
        }

        // 判断移动距离是否大于200px
        var startCoordinates = this.data.startCoordinates
        var endCoordinates = this.data.endCoordinates
        var minPixelLength = 30

        // 计算角度，判断滑动方向，必须为垂直方向偏移20度范围
        // 以右为0度，顺时针为正，逆时针为负
        // -180 ~ -160 || -110 ~ -70 || -20 ~ 20 || 70 ~ 110 || 160 ~ 180
        var endX = endCoordinates.x - startCoordinates.x
        var endY = endCoordinates.y - startCoordinates.y
        var radain = Math.atan2(endY, endX)  // 移动弧度
        var angle = radain * 180 / Math.PI  // 移动角度
        var direction = false  // 移动方向
        var radial = 0  // 径向位置移动距离
        switch(true) {
            case -180 < angle && angle < -160:
            case 160 < angle && angle < 180: // 左
                direction = 'left'
                radial = Math.abs(endX)
                break
            case -110 < angle && angle < -70: // 上
                direction = 'up'
                radial = Math.abs(endY)
                break
            case -20 < angle && angle < 20: // 右
                direction = 'right'
                radial = Math.abs(endX)
                break
            case 70 < angle && angle < 110: // 下
                direction = 'down'
                radial = Math.abs(endY)
                break
            default:
                console.log("trigger error")
                return false
        }

        // 移动距离过短
        if(radial < minPixelLength) {
            console.log("radial is too short")
            return false
        }

        console.log(direction)

        // 暂时不可再触发事件
        this.setData({
            pause: true
        })

        // TODO: 主要操作
        this.setData({
            direction: direction
        })

        // 操作完成后还原
        setTimeout(() => {
            this.setData({
                pause: false,
                direction: false
            })
        }, 1000)

    },


    animation: function() {
        requestAnimationFrame(this.animation)

        if(this.data.direction === false) {
            return false
        }

        switch(this.data.direction) {
            case 'up':

                break
        }

        this.addItem()

    },


    addItem: function() {
        var ctx = this.data.ctx

        ctx.setFillStyle('red')
        ctx.fillRect(0,0,10,10)

        ctx.draw()

        console.log(ctx)
    },

    box: function() {
        this.col = 1
        this.row = 1
        this.num = 2

    }



})