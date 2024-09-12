# Multi Image Uploader

A customizable, drag-and-drop image uploader built with React and MUI. Supports multiple image uploads, sorting, and file type validation. Allows reordering images with a preview and handles readonly and loading states using react.

## Features

- Drag and drop image uploader with live preview.
- Image reordering using drag-and-drop.
- Supports minimum and maximum number of images.
- File type validation for image uploads.
- Configurable placeholder for image slots.
- Readonly mode to disable editing features.
- Loading state for skeleton placeholders while images are being fetched.

## Installation

Install the package using npm or yarn:

```bash
npm install multi-image-uploader
```

Or

```bash
yarn add multi-image-uploader
```

## Usage

Import the `ImageUploader` component into your React project and configure it according to your needs:

```tsx
import React from 'react';
import ImageUploader, { OnImageUploaderProps } from 'multi-image-uploader';

const App = () => {
  const handleUpload = (files: OnImageUploaderProps[]) => {
    console.log('Uploaded files:', files);
  };

  return (
    <ImageUploader
      minImages={3}
      maxImages={5}
      validImages={[{ url: 'https://example.com/image1.jpg', order: 1 }]}
      onUpload={handleUpload}
      acceptTypes={['image/jpeg', 'image/png']}
      readonly={false}
      loading={false}
    />
  );
};

export default App;
```

## Props

| Prop Name     | Type                                      | Default                              | Description                                                                                               |
|---------------|-------------------------------------------|--------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `onUpload`    | `(files: OnImageUploaderProps[]) => void`  | **Required**                         | Function to handle file upload after clicking "Save Files".                                                |
| `minImages`   | `number`                                  | `3`                                  | Minimum number of images to display.                                                                      |
| `maxImages`   | `number`                                  | `5`                                  | Maximum number of images that can be uploaded. Set to `0` for unlimited images.                            |
| `validImages` | `{ url: string; order: number }[]`        | `[]`                                 | Pre-filled list of images to display in the uploader.                                                      |
| `readonly`    | `boolean`                                 | `false`                              | If set to `true`, disables all file input and image manipulation (only shows images).                      |
| `acceptTypes` | `string[]`                                | `['image/jpeg', 'image/jpg', 'image/png']` | Array of accepted file types for image upload.                                                             |
| `loading`     | `boolean`                                 | `false`                              | Displays skeleton loaders for images if `true`. Useful for when fetching images.                           |

## Image Slot States

The image slots in the uploader have the following states:

- **Placeholder**: Empty slots where users can upload images.
- **Image Uploaded**: Displays a preview of the uploaded image.
- **Loading**: Displays a skeleton loader when the `loading` prop is set to `true`.

## Sorting

The uploader supports drag-and-drop sorting, allowing users to reorder images. You can implement custom logic by handling the sort change via internal state management.

## Example of Image Upload Data Structure

The `onUpload` function returns an array of objects containing the uploaded `file` and its corresponding `order`:

```json
[
  {
    "file": [File], // Image file object
    "order": 1      // Order after sorting
  },
  {
    "file": [File],
    "order": 2
  }
]
```

## Readonly Mode

The `readonly` prop disables all upload and delete functionalities. It only shows the images that have been uploaded or passed via the `validImages` prop.

```tsx
<ImageUploader
  readonly={true}
  validImages={[{ url: 'https://example.com/image1.jpg', order: 1 }]}
/>
```
