import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

const RHFUploadFile = ({ name, handleSelectFile, imageRef, ...other }) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <input
                    type='file'
                    onChange={(e) => {
                        const reader = new FileReader();
                        const file = e.target.files[0];
                        reader.onload = () => {
                            if (reader.readyState === 2) {
                                field.onChange(reader.result);
                            }
                        }
                        if (file) {
                            reader.readAsDataURL(file);
                            handleSelectFile(file);
                        }
                    }}
                    ref={(instance) => {
                        field.ref(instance);
                        imageRef.current = instance;
                    }}
                    {...other}
                />
            )}
        />
    );
};

export default RHFUploadFile;