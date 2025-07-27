# RESTful API Documentation

The response data will be in JSON. The request body should be in JSON as well.

All paths in the response data are relative to the `base_dir` of the hexo blog, and those in the request data are expected to be so as well.

## Base URL

All the API is under the path `/editor/api`.

## Endpoints

### GET `/fs/file`

Retrieve the metadata and contents of a file.

#### Query Parameters

| Name | Type   | Required | Description                       |
| ---- | ------ | -------- | --------------------------------- |
| path | string | Yes      | The path of the file to retrieve. |

#### Response

##### `200 OK`

```json
{ "data": "Hello, World." }
```

### POST `/fs/file`

Writes data to a file.

#### Request Body

| Name | Type   | Required | Description                       |
| ---- | ------ | -------- | --------------------------------- |
| path | string | Yes      | The path of the file to write to. |
| data | string | Yes      | The content to write to the file. |

```json
{
    "path": "/path/to/file",
    "data": "Hello, World."
}
```

#### Response

##### `201 Created`

### GET `/fs/directory`

Retrieves the contents of a directory.

#### Query Parameters

| Name | Type   | Required | Description                                 |
| ---- | ------ | -------- | ------------------------------------------- |
| path | string | Yes      | The path of the directory to retrieve from. |

#### Response

##### `200 OK`

```json
{
    "contents": [
        { "type": "file", "name": "file.txt" },
        { "type": "directory", "name": "directory" }
    ]
}
```

### POST `/hexo/post`

Creates a new Hexo post.

#### Request Body

| Name    | Type    | Required | Description                                                                 |
| ------- | ------- | -------- | --------------------------------------------------------------------------- |
| title   | string  | Yes      | The title of the post.                                                      |
| layout  | string  | No       | The layout to use. Defaults to the `default_layout` setting of Hexo.        |
| slug    | string  | No       | The slug(URL) of the post.                                                  |
| path    | string  | No       | The path of the post file. Defaults to the `new_post_past` setting of Hexo. |
| replace | boolean | No       | Whether to replace existing files or not. Default: `false`                  |

```json
{
    "title": "My First Post",
    "layout": "post", // optional
    "slug": "first-post", // optional
    "path": "first/post", // optional
    "replace": false // optional
}
```

#### Response

##### `201 Created`

```json
{
    "path": "path/to/the/new/post/file",
    "content": "Content of the new post file."
}
```

## Error

All endpoints will return a `500 Internal Server Error` with the response body containing an additional error message.

```json
{ "error": "Error. Something went wrong." }
```
