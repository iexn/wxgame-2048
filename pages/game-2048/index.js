// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		matrix: [],  // 主游戏方阵
		matrixSize: 4,     // 游戏方阵宽度
		stepNumber: [2,4], // 每次生成的新数字只能为此数组内数字
		lastActionTimeStamp: 0, // 最后一次事件过渡时间戳
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		// 获取画布环境
    var ctx = wx.createCanvasContext("wxgame")

		// 生成初始布点
		this.initMatrix()

		console.log(this.data)

  },

	// 初始化方阵
	initMatrix: function() {
		var rowItem = []
		var matrixSize = this.data.matrixSize
		for(var i = 0; i < matrixSize; i++) {
			rowItem.push(0)
		}
		for(var i = 0; i < matrixSize; i++) {
			this.data.matrix.push(rowItem)
		}
	},

	// 添加新数字到方阵中
	addItem: function(count = 1) {
		Math.random()
	},

	// 开始事件
  touchStart: function(event) {
		this.data.lastActionTimeStamp = event.timeStamp
    console.log(event)
		console.log(Math.random() * 4)
  },

	// 检测滑动方向
	touchMove: function(event) {
		console.log(event)
	},

	// 真正执行步骤
	touchEnd: function(event) {
		// 单次操作时间过长，操作取消
		if(event.timeStamp - this.data.lastActionTimeStamp > 2000) {
			return false
		}

		// TODO: 主要操作

	}
})
