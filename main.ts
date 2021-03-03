basic.forever(function () {
    // on
    pins.setPull(DigitalPin.P8, PinPullMode.PullUp)
    
    pins.i2cWriteBuffer(0X5D, Buffer.fromHex('01142100'))
    pins.i2cWriteBuffer(0X5D, Buffer.fromHex('0001'))
    basic.pause(500)

    pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
    basic.pause(200)
    

    // off
    pins.setPull(DigitalPin.P8, PinPullMode.PullUp)

    pins.i2cWriteBuffer(0X5D, Buffer.fromHex('01142100'))
    pins.i2cWriteBuffer(0X5D, Buffer.fromHex('0002'))
    basic.pause(500)

    pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
    basic.pause(200)
    control.reset()
})
