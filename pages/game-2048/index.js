// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		matrix: [],  // 主游戏方阵
		matrixSize: 4,     // 游戏方阵宽度
		stepNumber: [2,2,2,4], // 每次生成的新数字只能为此数组内数字
		lastActionTimeStamp: 0, // 最后一次事件过渡时间戳
		margin: "",
		pause: false,
		startCoordinates: [],
		endCoordinates: [],
		direction: false, // 方向 up down left right
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		// 获取画布环境
    var ctx = wx.createCanvasContext("wxgame")

		// 生成初始布点
		this.initMatrix()

		// 添加一个初始数字
		this.addItem()

		// requestAnimationFrame(this.animation)

  },

	// 初始化方阵
	initMatrix: function() {
		var rowItem = []
		var matrixSize = this.data.matrixSize
		for(var i = 0; i < matrixSize; i++) {
			rowItem.push(0)
		}
		var matrix = [];
		for(var i = 0; i < matrixSize; i++) {
			matrix.push([].concat(rowItem))
		}
		this.setData({
			matrix: matrix
		});
	},

	// 添加新数字到方阵中
	addItem: function(count = 1) {

		// +-------------------
		// | 生成新数字
		// +-------------------
		var stepNumber = this.data.stepNumber
		var stepNumberLength = stepNumber.length
		// 随机获取数字
		var step = stepNumber[parseInt(Math.random() * (stepNumberLength - 1))]

		// 获取空白位置
		var matrix = this.data.matrix
		var randomLocal = []
		for(var i = 0; i < matrix.length; i++) {
			for(var j = 0; j < matrix[i].length; j++) {
				if(matrix[i][j] === 0) {
					randomLocal.push([i, j])
				}
			}
		}

		// 没有空白位置，游戏结束
		if(randomLocal.length === 0) {
			this.gameEnd()
			console.log("game over")
			return false
		}

		// 随机一个空白位置，放入数字
		var randomLocalLength = randomLocal.length
		var local = randomLocal[parseInt(Math.random() * (randomLocalLength - 1))]
		matrix[local[0]][local[1]] = step

		// 保存结果
		this.setData({
			matrix: matrix
		})

		return this

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

		// 执行动画
		this.animation(direction)


	},

	// 执行动画
	animation: function(direction) {
		// requestAnimationFrame(this.animation)
		switch(direction) {
			case 'up':

				break
			case 'down':
			case 'left':
			case 'right':
				break
			default:

		}

		this.saveMatrix(direction)

		this.setData({
			pause: false
		})

	},

	// 保存矩阵结果
	saveMatrix: function(direction) {
		var matrix = this.data.matrix

		// 是否阵列有所移动
		var isMove = false

		// 左右移动使用
		var row0 = [matrix[0][0], matrix[0][1], matrix[0][2], matrix[0][3]]
		var row1 = [matrix[1][0], matrix[1][1], matrix[1][2], matrix[1][3]]
		var row2 = [matrix[2][0], matrix[2][1], matrix[2][2], matrix[2][3]]
		var row3 = [matrix[3][0], matrix[3][1], matrix[3][2], matrix[3][3]]

		// 上下移动使用
		var col0 = [matrix[0][0], matrix[1][0], matrix[2][0], matrix[3][0]]
		var col1 = [matrix[0][1], matrix[1][1], matrix[2][1], matrix[3][1]]
		var col2 = [matrix[0][2], matrix[1][2], matrix[2][2], matrix[3][2]]
		var col3 = [matrix[0][3], matrix[1][3], matrix[2][3], matrix[3][3]]

		var move = true

		switch(direction) {
			case 'up':
				move = this.moveMatrixRow(col0, 'front')
				if(move !== false) {
					if(!isMove) {
						isMove = true
					}
					col0 = [].concat(move)
				}
				move = this.moveMatrixRow(col1, 'front')
				if(move !== false) {
					if(!isMove) {
						isMove = true
					}
					col1 = [].concat(move)
				}
				move = this.moveMatrixRow(col2, 'front')
				if(move !== false) {
					if(!isMove) {
						isMove = true
					}
					col2 = [].concat(move)
				}
				move = this.moveMatrixRow(col3, 'front')
				if(move !== false) {
					if(!isMove) {
						isMove = true
					}
					col3 = [].concat(move)
				}
				this.setData({
					matrix: [
						[col0[0],col1[0],col2[0],col3[0]],
						[col0[1],col1[1],col2[1],col3[1]],
						[col0[2],col1[2],col2[2],col3[2]],
						[col0[3],col1[3],col2[3],col3[3]],
					]
				})
				break
			case 'down':
				move = this.moveMatrixRow(col0, 'behind')
				if(move !== false) {
					if(!isMove) {
						isMove = true
					}
					col0 = [].concat(move)
				}
				move = this.moveMatrixRow(col1, 'behind')
				if(move !== false) {
					if(!isMove) {
						isMove = true
					}
					col1 = [].concat(move)
				}
				move = this.moveMatrixRow(col2, 'behind')
				if(move !== false) {
					if(!isMove) {
						isMove = true
					}
					col2 = [].concat(move)
				}
				move = this.moveMatrixRow(col3, 'behind')
				if(move !== false) {
					if(!isMove) {
						isMove = true
					}
					col3 = [].concat(move)
				}

				this.setData({
					matrix: [
						[col0[0],col1[0],col2[0],col3[0]],
						[col0[1],col1[1],col2[1],col3[1]],
						[col0[2],col1[2],col2[2],col3[2]],
						[col0[3],col1[3],col2[3],col3[3]],
					]
				})
				
				break
			case 'left':
			case 'right':
				break
			default:

		}

		if(isMove) {
			this.addItem()
		}

	},

	// 指定数组（单行），返回移动后的结果
	// type 只能为 front前 或 behind 后
	// 返回：true为阵列移动过，false为没有
	moveMatrixRow: function(matrixRow, type) {
		if(['front', 'behind'].indexOf(type) === -1) {
			console.log("move error")
			throw new error("moveMatrixRow's type error")
			return false
		}

		if(type === 'behind') {
			matrixRow = matrixRow.reverse()
		}

		var newRow = []

		var matrixRowR = [...matrixRow, false]

		matrixRowR.reduce(function(beforeVal, thisVal) {
			// 如果为0，跳过处理
			if(thisVal === 0) {
				return beforeVal
			}

			if(beforeVal === false) {
				return thisVal
			}
			// 最后一个值
			if(thisVal === false && beforeVal !== 0) {
				newRow.push(thisVal)
				return false
			}

			if(beforeVal === thisVal) {
				newRow.push(beforeVal + thisVal)
				return false
			} else {
				newRow.push(beforeVal)
				return thisVal
			}

			console.log(newRow)

		}, false)

		// 填补0
		while(newRow.length < matrixSize) {
			newRow.push(0)
		}

		if(newRow.join(',') === matrixRow.join(',')) {
			return false
		}

		if(type === 'behind') {
			newRow = newRow.reverse()
		}

		return newRow

	},

	// 游戏结束
	gameEnd: function() {

	}
})
