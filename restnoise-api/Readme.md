Commodity groups & Commodity types
---
**POST /commoditygroups**

Creates a commodity group.

Parameters:

| Key | Description | Example |
|-----|-------------|---------|
| name| Name of the commodity group | Food |


Response: The created commodity group

Example call:

```POST http://localhost:3000/commoditygroups```

POST params:
```
{"name":"Food"}
```

Response:
```
{
  "_id" : "53ecc9af73fee3b418f74097",
  "__v" : 0,
  "name" : "Food"
}
```

**GET /commoditygroups**

Returns all available commodity groups.

Response: List of all available commodity groups

Example call:

```GET http://localhost:3000/commoditygroups```

Response:
```
[
  {
    "_id" : "53ecc9af73fee3b418f74097",
    "__v" : 0,
    "name" : "Food"
  }
]
```

**GET /commoditygroups/:commoditygroupid**

Returns data of one specific commodity group.

Response: Data of one specific commoditygroup

Example call:

```GET http://localhost:3000/commoditygroups/53ecc9af73fee3b418f74097```

Response:
```
{
  "_id" : "53ecc9af73fee3b418f74097",
  "__v" : 0,
  "name" : "Food"
}
```

**POST /commoditygroups/:commoditygroupid/commoditytypes**

Creates a commidity type within a commodity group.

Parameters:

| Key | Description | Example |
|-----|-------------|---------|
| name| Name of the commodity type | Grain |


Response: The created commodity type.

Example call:

```POST http://localhost:3000/commoditygroups/53ecc9af73fee3b418f74097/commoditytypes```

POST params:
```
{"name":"Grain"}
```

Response:
```
{
  "_id" : "53eccae673fee3b418f74098",
  "__v" : 0,
  "commoditygroup" : "53ecc9af73fee3b418f74097",
  "name" : "Grain"
}
```

**GET /commoditygroups/:commoditygroupid/commoditytypes**

Returns all commodity types of a given commodity group.

Response: List of commodity types.

Example call:

```GET http://localhost:3000/commoditygroups/53ecc9af73fee3b418f74097/commoditytypes```

Response:
```
[
  {
    "_id" : "53eccae673fee3b418f74098",
    "__v" : 0,
    "commoditygroup" : "53ecc9af73fee3b418f74097",
    "name" : "Grain"
  }
]
```

**GET /commoditygroups/:commoditygroupid/commoditytypes/:commoditytypeid**

**GET /commoditytypes/:commoditytypeid**

Returns data of a commodity type (of a given commodity group).

Response: Data of commodity type.

Example call:

```GET http://localhost:3000/commoditygroups/53ecc9af73fee3b418f74097/commoditytypes/53eccae673fee3b418f74098```

or

```GET http://localhost:3000/commoditytypes/53eccae673fee3b418f74098```

Response:
```
{
    "_id" : "53eccae673fee3b418f74098",
    "__v" : 0,
    "commoditygroup" : "53ecc9af73fee3b418f74097",
    "name" : "Grain"
}
```

Locations
---

**POST /locations**

Creates a location.

Parameters:

| Key | Description | Example |
|-----|-------------|---------|
| name| Name of the location | Foobar 3000 |


Response: The created location

Example call:

```POST http://localhost:3000/locations```

POST params:
```
{"name":"Foobar 3000"}
```

Response:
```
{
  "_id" : "53ecc7ac73fee3b418f74096",
  "__v" : 0,
  "commodities" : [],
  "connections" : [],
  "name" : "Foobar 3000"
}
```

**GET /locations**

Returns all locations.

Response: List of all available locations

Example call:

```GET http://localhost:3000/locations```

Response:
```
[
  {
    "_id" : "53ecc7ac73fee3b418f74096",
    "__v" : 0,
    "commodities" : [],
    "connections" : [],
    "name" : "Foobar 3000"
  }
]
```

**GET /locations/:locationid**

Returns data about a specific location.

Response: Data of one specific location

Example call:

```GET http://localhost:3000/locations/53ecc7ac73fee3b418f74096```

Response:
```
{
    "_id" : "53ecc7ac73fee3b418f74096",
    "__v" : 0,
    "commodities" : [],
    "connections" : [],
    "name" : "Foobar 3000"
}
```

**DELETE /locations/:locationid**

Deletes a location and all connections to it.

Example call:

```DELETE http://localhost:3000/locations/53ecc7ac73fee3b418f74096```

Response:
```
{ "ok" : 1 }
```

**POST /locations/:locationid/connections**

Creates a **onedirectional** connection between two locations.

| Key | Description | Example |
|-----|-------------|---------|
| destination| Id of the destination | 53ecc7ac73fee3b418f74096 |
| distance | The distance (or "cost") for this connection | 3.65 |

Response: The data of the source location.

Example call:

```POST http://locahost:3000/locations/53ecc7ac73fee3b418f74096/connections```

POST params:
```
{"destination":"53ecce3073fee3b418f74099","distance":3.65}
```

Response:
```
{
  "_id" : "53ecc7ac73fee3b418f74096",
  "__v" : 0,
  "commodities" : [],
  "connections" : [
    {
      "_id" : "53ecce7173fee3b418f7409a",
      "destination" : "53ecce3073fee3b418f74099",
      "distance" : 3.65
    }
  ],
  "name" : "Foobar 3000"
}
```

**POST /locations/:locationid/commodities**

Sets price information for a commodity type in a given location.

| Key | Description | Example |
|-----|-------------|---------|
| commoditytype| The id of the commodity type | 53eccae673fee3b418f74098 |
| buy | Buy price | 32 |
| sell | Sell price | 24 |
| demand | Current demand | 5000 |
| supply | Current supply | 30005 |

Response: The new data of the location.

Example call:

```POST http://locahost:3000/locations/53ecc7ac73fee3b418f74096/commodities```

POST params:
```
{"commoditytype":"53eccae673fee3b418f74098","buy":32,"sell":24,"demand":5000,"supply":3000}
```

Response:
```
{
  "_id" : "53ecc7ac73fee3b418f74096",
  "__v" : 0,
  "commodities" : [
    {
      "_id" : "53ecd04673fee3b418f7409c",
      "supply" : 3000,
      "demand" : 5000,
      "commoditytype" : "53eccae673fee3b418f74098",
      "buy" : 32,
      "sell" : 24
    }
  ],
  "connections" : [
    {
      "_id" : "53ecce7173fee3b418f7409a",
      "destination" : "53ecce3073fee3b418f74099",
      "distance" : 3.65
    }
  ],
  "name" : "Foobar 3000"
}
```

**PUT /locations/:locationid/commodities/:commodityid**

Sets price information for an **existing** commodity in a given location.

| Key | Description | Example |
|-----|-------------|---------|
| buy | Buy price | 32 |
| sell | Sell price | 24 |
| demand | Current demand | 5000 |
| supply | Current supply | 30005 |

Response: The new data of the location. Values not contained in the POST parameters will remain unchanged. The commoditytype can't be changed!

Example call:

```POST http://locahost:3000/locations/53ecc7ac73fee3b418f74096/commodities/53ecd04673fee3b418f7409c```

POST params:
```
{"buy":64}
```

Response:
```
{
  "_id" : "53ecc7ac73fee3b418f74096",
  "__v" : 0,
  "commodities" : [
    {
      "_id" : "53ecd04673fee3b418f7409c",
      "supply" : 3000,
      "demand" : 5000,
      "commoditytype" : "53eccae673fee3b418f74098",
      "buy" : 64,
      "sell" : 24
    }
  ],
  "connections" : [
    {
      "_id" : "53ecce7173fee3b418f7409a",
      "destination" : "53ecce3073fee3b418f74099",
      "distance" : 3.65
    }
  ],
  "name" : "Foobar 3000"
}
```

**GET /locations/:locationid/commodities/:commodityid/traderoutes**

Returns the best destination for selling the item.

Response: Object with destination, price and price per hop index.
The index value may be a little bit abstract and dependant on the algorithm used.
It basically sets the profit into relation to the amount of time which
would be used to get to the destination.
It is the quality index used for returning the best destination,
so the destination may not necessarily be the one with the best price!

Example call:

```GET http://localhost:3000/locations/53ecc7ac73fee3b418f74096/53ecd04673fee3b418f7409c/traderoutes```

Response:
```
{
    "destination" : "53ecce3073fee3b418f74099",
    "price" : 62,
    "price_per_hop_index" : 3.5
}
```
