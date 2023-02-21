declare type IsSupportedOptions = {
    failIfMajorPerformanceCaveat: boolean;
}

declare type IsSupported = {
    webGLContextAttributes: WebGLContextAttributes;
    (
        options?: IsSupportedOptions
    ): boolean;
};

export const supported: IsSupported;
export function notSupportedReason(options?: IsSupportedOptions): string;
