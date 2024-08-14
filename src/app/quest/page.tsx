'use client';

import AirdropImage from '@/assets/images/AirdropWeb.png';
import Rectangle from '@/assets/images/Rectangle_t.svg';
import RingIcon from '@/assets/images/ring.svg';
import StarIcon from '@/assets/images/star.svg';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionItem,
  Checkbox,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import Image from 'next/image';

const pointsArray = [
  {
    title: 'Follow Moniswap on X (Twitter) and turn on notification',
    points: 500,
    content: [
      'To pass this challenge, you must Follow Moniswap on X (Twitter) and turn on your notification.',
      'Please note, we sync this challenge every hour so please be patient and your progress will automatically update.',
    ],
    button: 'Follow',
  },
  {
    title: 'Follow Cappo on X (Twitter) and turn on notification',
    points: 500,
    content: [
      'To pass this challenge, you must Follow Cappo on X (Twitter) and turn on your notification.',
      'Please note, we sync this challenge every hour so please be patient and your progress will automatically update.',
    ],
    button: 'Follow',
  },
  {
    title: 'Follow Beraland on X (Twitter) and turn on notification',
    points: 500,
    content: [
      'To pass this challenge, you must Follow Beraland on X (Twitter) and turn on your notification.',
      'Please note, we sync this challenge every hour so please be patient and your progress will automatically update. ',
    ],
    button: 'Follow',
  },
  {
    title: 'Join Moniswap Discord',
    points: 500,
    content: [
      "To pass this challenge, you must Join Moniswap's Discord server and engage with the community.",
      'Please note, we sync this challenge every hour so please be patient and your progress will automatically update. ',
    ],
    button: 'Join Discord',
  },
  {
    title: 'Join Beraland Discord',
    points: 500,
    content: [
      "To pass this challenge, you must Join Berachain's Discord server and engage with the community.",
      'Please note, we sync this challenge every hour so please be patient and your progress will automatically update. ',
    ],
    button: 'Join Discord',
  },
  {
    title: 'Join Cappo Telegram group',
    points: 500,
    content: [
      "To pass this challenge, you must Join Cappo's Telegram group and communicate with fellow community members.",
      'Please note, we sync this challenge every hour so please be patient and your progress will automatically update.',
    ],
    button: 'Join Telegram',
  },
  {
    title: 'Join Moniswap Telegram group',
    points: 500,
    content: [
      "To pass this challenge, you must Join Moniswap's Telegram group and communicate with fellow community members.",
      'Please note, we sync this challenge every hour so please be patient and your progress will automatically update.',
    ],
    button: 'Join Telegram',
  },
  {
    title: 'Join Moniswap Telegram announcement',
    points: 500,
    content: [
      "To pass this challenge, you must Join Moniswap's Telegram announcement channel.",
      'Please note, we sync this challenge every hour so please be patient and your progress will automatically update.',
    ],
    button: 'Join Telegram',
  },
  {
    title: 'Trade on Moniswap',
    points: 1000,
    content: [
      'To pass this challenge, you must Participate in atleast 10 trading activities on the Moniswap platform.',
      'Please note, we sync this challenge every hour so please be patient and your progress will automatically update.',
    ],
    button: 'Trade Now!',
  },
  {
    title: 'Provide Liquidity on Moniswap',
    points: 2000,
    content: [
      'To pass this challenge, you must Contribute liquidity to the Moniswap platform by providing assets to liquidity pools.',
      'Please note, we sync this challenge every hour so please be patient and your progress will automatically update.',
    ],
    button: 'Add Liquidity',
  },
  {
    title: 'Hold Bera Pack NFT',
    points: 20000,
    content: [
      'To pass this challenge, you must Hold Bera Pack NFT.',
      'Please note, we sync this challenge every hour so please be patient and your progress will automatically update.',
    ],
    button: 'Check',
  },
];

export default function Page() {
  return (
    <div className="relative space-y-5 overflow-hidden p-5 lg:px-20">
      <Image
        alt="image"
        src={Rectangle}
        width={200}
        height={200}
        className="absolute right-[-100px] top-[-100px] lg:right-[-70px] lg:top-[-70px]"
      />
      <div className="flex flex-col-reverse gap-3 pt-5 lg:flex-row">
        <div className="flex-1 space-y-5 lg:pt-32">
          <div className="lg:space-y-5">
            <h1 className="text-2xl lg:text-5xl">
              Join Moniswap Airdrop Campaign{' '}
              <span className="w-full bg-gradient-to-r from-btn-primary to-gold bg-clip-text text-transparent">
                Quest
              </span>
            </h1>

            <p className="text-swapBox">
              Complete both off-chain and on-chain quests to earn points. The
              more points you accumulate, the greater the rewards you will
              collect.
            </p>
          </div>

          <div className="space-y-3 bg-brightBlack p-5 lg:max-w-[450px]">
            <div className="flex gap-3">
              <Image src={RingIcon} alt="RingIcon" />
              <p>
                4,301 <span className="text-gray1">points</span>
              </p>
            </div>
            <Divider className="bg-gray2" />
            <div className="flex gap-3">
              <Image src={StarIcon} alt="RingIcon" />
              Ranked # <span className="text-gray1">13963</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Image src={AirdropImage} alt="airdrop image" className="m-auto" />
        </div>
      </div>

      <div className="bg-brightBlack px-3 py-5">
        <Accordion variant="splitted">
          {pointsArray.map((item, index) => {
            return (
              <AccordionItem
                key={index}
                aria-label={item.title}
                title={
                  <div className="flex items-center justify-between gap-2 text-xs lg:text-base">
                    <div className="flex items-center">
                      <Checkbox
                        size="lg"
                        radius="full"
                        color="warning"
                        classNames={{
                          icon: 'text-white',
                        }}
                      />
                      {item.title}
                    </div>
                    <div className="flex-shrink-0">+{item.points} points</div>
                  </div>
                }
                classNames={{
                  base: '!bg-darkBlack !rounded-none',
                  title: 'text-white',
                }}
              >
                <div className="space-y-5">
                  {item.content?.map((text, index) => {
                    return (
                      <p
                        className="text-xs text-gray1 lg:text-base"
                        key={index}
                      >
                        {text}
                      </p>
                    );
                  })}

                  <Button variant="primary" size="full">
                    {item?.button}
                  </Button>
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <div className="space-y-3 bg-brightBlack p-5">
        <p className="text-2xl">Refer a Friend to Multiply your Score!</p>

        <p className="text-sm text-gray1">
          When your friends sign up and onboard via your referral link, you both
          increase the multiplier on your score.
        </p>

        <p className="text-sm text-gray1">
          You&apos;ve already referred 0 new users, of these 0 new users are
          counted to your referral multiple. After your next referral, your new
          score multiplier will be 2x and your total points will increase to
          400!
        </p>

        <div className="border border-lightGray p-3 text-sm">
          https://moniswap.finance/seekers/?referral=840oa4yi
        </div>

        <div className="w-full gap-3 space-y-3 lg:flex lg:space-y-0">
          <Button
            classNames={{
              wrapper: 'w-full',
              base: 'w-full text-sm text-gray1',
            }}
          >
            Copy referral link
          </Button>
          <Button
            classNames={{
              wrapper: 'w-full',
              base: 'w-full text-sm text-gray1',
            }}
          >
            Send as email
          </Button>
          <Button
            classNames={{
              wrapper: 'w-full',
              base: 'w-full text-sm text-gray1',
            }}
          >
            Post on X (Twitter)
          </Button>
        </div>
      </div>

      <div className="space-y-3 bg-brightBlack p-5">
        <div className="flex flex-col items-start justify-between gap-2 lg:flex-row">
          <div>
            <p className="text-lg lg:text-2xl">The Leaderboard</p>
            <p className="text-xs text-gray1 lg:text-sm">
              Complete to get the highest score, you can do it!
            </p>
          </div>
          <p className="text-base lg:text-xl">
            You are ranked 13,959 of 290,250 participants
          </p>
        </div>

        <div>
          <Table
            aria-label="ranking table"
            removeWrapper
            classNames={{
              th: 'bg-darkBlack text-white text-balance',
              tbody: 'text-gray1',
              td: 'break-words',
            }}
          >
            <TableHeader>
              <TableColumn>#</TableColumn>
              <TableColumn>NAME</TableColumn>
              <TableColumn>Verified Referral Multiplier</TableColumn>
              <TableColumn>Total Score</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell>1</TableCell>
                <TableCell>0x6FE...e6d11</TableCell>
                <TableCell>350x</TableCell>
                <TableCell>4,095,000 points</TableCell>
              </TableRow>
              <TableRow key="2">
                <TableCell>2</TableCell>
                <TableCell>0xF27...18F7c</TableCell>
                <TableCell>346x</TableCell>
                <TableCell>2,906,400 points</TableCell>
              </TableRow>
              <TableRow key="3">
                <TableCell>3</TableCell>
                <TableCell>0x537...461d4</TableCell>
                <TableCell>698x</TableCell>
                <TableCell>1,884,600 points</TableCell>
              </TableRow>
              <TableRow key="4">
                <TableCell>4</TableCell>
                <TableCell>0x207...D673E</TableCell>
                <TableCell>697x</TableCell>
                <TableCell>1,184,900 points</TableCell>
              </TableRow>
              <TableRow key="5">
                <TableCell>5</TableCell>
                <TableCell>0x35c...DD2D2</TableCell>
                <TableCell>108x</TableCell>
                <TableCell>723,600 points</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
