import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Popover as NextPopover,
    PopoverContent,
    PopoverTrigger,
} from "@nextui-org/react";
import { FC } from "react";

type Props = {
    content: string;
};

export const Popover: FC<Props> = ({ content }) => {
    return (
        <NextPopover placement="top" showArrow={true} color="foreground">
            <PopoverTrigger>
                <FontAwesomeIcon
                    icon={faCircleQuestion}
                    className="cursor-pointer"
                />
            </PopoverTrigger>
            <PopoverContent>
                <div className="max-w-[250px] break-words border border-[#F59855] p-4 backdrop-blur-xl">
                    {content}
                </div>
            </PopoverContent>
        </NextPopover>
    );
};
