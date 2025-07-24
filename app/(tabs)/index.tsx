import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '~/components/ui/Button';
import {
  daysBetweenHijriDates,
  getHijriWeekdayLocalized,
  getMoonPhaseInfo,
  getNextHijriHolidayOrSpecialDay,
} from '~/utils/helpers';
import { Container } from '~/components/ui/Container';
import moment from 'moment-hijri';
import { imageMapper } from '~/utils/imageMapper';
import { Divider } from '~/components/ui/Divider';
import plannedEventsData from '~/data/temp/plannedEventsData.json';
import holidaysData from '~/data/islamicEvents/holidaysData.json';
import specialDaysData from '~/data/islamicEvents/specialDaysData.json';
import subspecialDaysData from '~/data/islamicEvents/subspecialDaysData.json';
import { useQuery } from '@tanstack/react-query';
import { fetchAladhanApi } from '~/axios/configs/aladhanAxios';
import { Text } from '~/components/ui/Text';
import { Cardtest } from '~/components/ui/Cardtest';
import Card from '~/components/ui/Card';

export default function HomeScreen() {
  const router = useRouter();
  const hijriDate = moment();
  const hijriDateFormatted = hijriDate.format('iD iMMMM iYYYY');
  const hijriDay = hijriDate.iDate();
  const gregorianDateFormatted = moment(hijriDate).format('dddd, MMMM Do YYYY');
  const { plannedEvents } = plannedEventsData;
  const { holidays } = holidaysData;
  const { specialDays } = specialDaysData;
  const { subspecialDays } = subspecialDaysData;
  const allSpecialDays = [...specialDays, ...subspecialDays[0].items, ...subspecialDays[1].items];

  const moonPhase = getMoonPhaseInfo(hijriDay);

  // Dua of the Day
  const duaOfTheDay = 'O Allah, You are forgiving and love forgiveness, so forgive me.';

  const upcomingSpecialDay = getNextHijriHolidayOrSpecialDay(
    allSpecialDays,
    hijriDate.iYear(),
    hijriDate.iMonth(),
    hijriDate.iDate()
  );
  const upcomingSpecialDayStr = `${upcomingSpecialDay.day}-${upcomingSpecialDay.month}-${hijriDate.iYear()}`;
  const { data: upcomingSpecialDayGregorianDate } = useQuery({
    queryKey: ['upcomingSpecialDayGregorianDate'],
    queryFn: async () => {
      const res = await fetchAladhanApi.get(`/hToG/${upcomingSpecialDayStr}`);
      const [day, month, year] = res.data.data.gregorian.date.split('-');
      return `${year}-${month}-${day}`;
    },
  });

  const upcomingHoliday = getNextHijriHolidayOrSpecialDay(
    holidays,
    hijriDate.iYear(),
    hijriDate.iMonth(),
    hijriDate.iDate()
  );
  const upcomingHolidayStr = `${upcomingHoliday.day}-${upcomingHoliday.month}-${hijriDate.iYear()}`;
  const { data: upcomingHolidayGregorianDate } = useQuery({
    queryKey: ['upcomingHolidayGregorianDate'],
    queryFn: async () => {
      const res = await fetchAladhanApi.get(`/hToG/${upcomingHolidayStr}`);
      const [day, month, year] = res.data.data.gregorian.date.split('-');
      return `${year}-${month}-${day}`;
    },
  });
  const daysUntil = daysBetweenHijriDates(
    upcomingSpecialDayStr,
    hijriDate.add(1, 'year').format('iD-iMM-iYYYY')
  );
  const daysUntil2 = hijriDate.diff(moment(), 'days');

  return (
    <Container>
      <View className="pt-8">
        {/*Date Section*/}
        <View className="mb-8 items-center">
          <Text className="text-2xl font-bold text-blue-700">
            {getHijriWeekdayLocalized(moment())} ،{hijriDateFormatted}
          </Text>
          <Text className="text-lg text-gray-500">{gregorianDateFormatted}</Text>
        </View>

        {/*Moon Phase and Countdown row*/}
        <View className="mb-8 flex-row justify-between px-1">
          {/*Moon Phase*/}
          <Card className="flex-row items-center rounded-xl bg-white/80 px-3 py-2 shadow">
            <Text className="mr-2 text-2xl">{moonPhase.icon}</Text>
            <Text className="font-medium">{moonPhase.label}</Text>
          </Card>

          {/*Countdown*/}
          {upcomingSpecialDay && (
            <Card className="flex-row items-center rounded-xl bg-white/80 px-3 py-2 shadow">
              <Text className="mr-2 text-xl">⏳</Text>
              <View>
                <Text className="font-bold">{daysUntil} days</Text>
                <Text className="text-xs">{`Until ${upcomingSpecialDay.name}`}</Text>
              </View>
            </Card>
          )}
        </View>

        {/*Upcoming Special Day*/}
        <Text className="mb-3 text-sm font-semibold uppercase">Upcoming special day</Text>
        <TouchableOpacity
          activeOpacity={0.93}
          onPress={() =>
            router.push({
              pathname: '/islamicEventInfoModal',
              params: { islamicEvent: JSON.stringify(upcomingSpecialDay) },
            })
          }>
          <Card className="flex-row rounded-2xl shadow">
            <Image
              source={imageMapper[upcomingSpecialDay.imageUrl]}
              className="h-[148px] w-24 rounded-l-xl"
              resizeMode="cover"
            />
            <View className="flex-1 justify-center p-4">
              <Text className="text-lg font-bold">{upcomingSpecialDay?.name}</Text>
              <Text className="">{upcomingSpecialDay?.quote}</Text>
              <Text className="text-sm mt-2">
                Expected on{' '}
                {new Date(upcomingSpecialDayGregorianDate ?? '').toLocaleDateString(undefined, {
                  day: 'numeric',
                  year: 'numeric',
                  month: 'long',
                })}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/*Upcoming Holiday*/}
        <Text className="mb-3 mt-6 text-sm font-semibold uppercase">Upcoming Holiday</Text>
        <TouchableOpacity
          activeOpacity={0.93}
          onPress={() =>
            router.push({
              pathname: '/islamicEventInfoModal',
              params: { islamicEvent: JSON.stringify(upcomingHoliday) },
            })
          }>
          <Card className="rounded-2xl shadow">
            <View className="flex-row items-center p-4">
              <Text className="mr-3 text-2xl">🎉</Text>
              <View>
                <Text className="mb-1 font-bold">
                  {upcomingHoliday?.name} on {upcomingHoliday?.dateLabel}
                </Text>
                <Text className="text-sm">
                  Expected on{' '}
                  {new Date(upcomingHolidayGregorianDate ?? '').toLocaleDateString(undefined, {
                    day: 'numeric',
                    year: 'numeric',
                    month: 'long',
                  })}
                </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        <Divider className="my-6" color="#d1d5db" />

        {/*Upcoming Planned Event*/}
        <Text className="mb-2 text-sm font-semibold uppercase">Next Planned</Text>
        <Card className="flex-row items-center rounded-2xl p-4 shadow mb-6">
          <Text className="mr-3 text-2xl">📅</Text>
          <View>
            <Text className="font-bold">{plannedEvents[0].description}</Text>
            <Text className="text-sm">{plannedEvents[0].date}</Text>
          </View>
        </Card>

        {/*Dua of the Day*/}
        {/*<View className="mb-20 rounded-xl bg-yellow-50 p-4 shadow">*/}
        {/*  <Text className="mb-1 text-sm font-semibold text-gray-300 text-yellow-800">*/}
        {/*    Dua of the Day*/}
        {/*  </Text>*/}
        {/*  <Text className="italic text-yellow-900">{duaOfTheDay}</Text>*/}
        {/*</View>*/}

        {/*Action Buttons*/}
        <View className="flex-row justify-between pb-6">
          <Button
            className="mr-2 flex-1"
            variant="primary"
            title="Go to Calendar"
            onPress={() => router.push('/calendar')}
          />
          <Button
            className="ml-2 flex-1"
            variant="secondary"
            title="Add Activity"
            onPress={() => router.push('/addActivity')}
          />
        </View>
      </View>
    </Container>
  );
}
