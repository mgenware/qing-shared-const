/** This is a header. */

package test

import (
	"encoding/json"
	"io/ioutil"
)

// Test ...
type Test struct {
	Hello      string  `json:"hello"`
	World      string  `json:"world"`
	IntProp    int     `json:"intProp"`
	DoubleProp float64 `json:"doubleProp"`
}

// ParseTest loads a Test from a JSON file.
func ParseTest(file string) (*Test, error) {
	bytes, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, err
	}

	var data Test
	err = json.Unmarshal(bytes, &data)
	if err != nil {
		return nil, err
	}
	return &data, nil
}
