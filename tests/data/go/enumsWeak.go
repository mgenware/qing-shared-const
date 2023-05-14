package test

const Str = "hello world"
const IntProp = 123
const DoubleProp = 12.3

type Color int

const (
	ColorRed Color = iota + 1
	ColorBlue
)

const (
	Color2Red = iota + 1
	Color2Blue
)
