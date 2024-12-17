'use client';
import React, { useEffect, useRef, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Button, Image, Upload } from 'antd';

type FileType = Blob | File;

const urlToUploadFile = (url: string, index: number): UploadFile => ({
  uid: String(index),
  name: `image${index}`,
  status: 'done',
  url: url,
});

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// Helper function to compare arrays
function arraysAreEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const Uploader: React.FC<{
  onFilesChange?: (files: UploadFile[]) => void;
  defaultFiles?: string[];
}> = ({ onFilesChange, defaultFiles = [] }) => {
  const initialFiles = defaultFiles.map((url, index) =>
    urlToUploadFile(url, index)
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>(initialFiles);

  const prevDefaultFilesRef = useRef<string[]>(defaultFiles);

  useEffect(() => {
    if (!arraysAreEqual(prevDefaultFilesRef.current, defaultFiles)) {
      setFileList(initialFiles);
      prevDefaultFilesRef.current = defaultFiles;
    }
  }, [defaultFiles, initialFiles]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    newFileList.forEach((file) => {
      if (file.response && file.response.url) {
        file.url = file.response.url;
      }
    });

    if (onFilesChange) {
      onFilesChange(newFileList);
    }
  };

  const uploadButton = (
    <Button
      type="default"
      style={{ border: 0, background: 'none' }}
      className="shadow-none"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </Button>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        itemRender={(originNode) => (
          <div>
            <div style={{ width: 100, height: 100, overflow: 'hidden' }}>
              {originNode}
            </div>
          </div>
        )}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
          alt="Preview Image"
        />
      )}
    </>
  );
};

export default Uploader;
