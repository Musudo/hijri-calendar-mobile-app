import React, { useState } from 'react';
import { Dimensions, FlatList, Pressable, View, Text as RNText } from 'react-native';
import moment from 'moment-hijri';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  arabicDigits,
  hijriMonthsArabic,
  hijriMonthsTranslit,
  hijriWeekdaysArabic,
  hijriWeekdaysTranslit,
  hijriWeekDaysTranslitShort,
} from '~/constants/calendarConstants';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/Store';
import specialDaysData from '~/data/islamicEvents/specialDaysData.json';
import subspecialDaysData from '~/data/islamicEvents/subspecialDaysData.json';
import holidaysData from '~/data/islamicEvents/holidaysData.json';
import plannedEventsData from '~/data/temp/plannedEventsData.json';
import { Button } from '~/components/ui/Button';
import { Cardtest, CardContent, CardTitle } from '~/components/ui/Cardtest';
import { useRouter } from 'expo-router';
import { Text } from '~/components/ui/Text';
import Card from "~/components/ui/Card";
import {Divider} from "~/components/ui/Divider";

type Direction = 'next' | 'prev';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HijriCalendar() {
  const router = useRouter();
  const isArabic = useSelector((state: RootState) => state.calendarSettings.arabicCalendar);
  const useShortTranslit = useSelector(
    (state: RootState) => state.calendarSettings.fullArabicWeekdays
  );
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDay, setSelectedDay] = useState<moment.Moment | null>(moment());
  const todayHijri = moment().format('iYYYY/iM/iD'); // example "1446/12/3"
  const translateX = useSharedValue(0);
  const { specialDays } = specialDaysData;
  const { subspecialDays } = subspecialDaysData;
  const { holidays } = holidaysData;
  const { plannedEvents } = plannedEventsData;
  const allSubSpecialDays = [...subspecialDays[0].items, ...subspecialDays[1].items];

  /* Calendar container functionality */

  const changeMonth = (direction: Direction) => {
    setCurrentDate((prev) =>
      direction === 'next' ? prev.clone().add(1, 'iMonth') : prev.clone().subtract(1, 'iMonth')
    );
  };

  const swipeGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX > 80) {
        // Swipe to the previous month
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 250 }, () => {
          translateX.value = -SCREEN_WIDTH;
          runOnJS(changeMonth)('prev');
          translateX.value = withTiming(0, { duration: 250 });
        });
      } else if (e.translationX < -80) {
        // Swipe to next month
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 250 }, () => {
          translateX.value = SCREEN_WIDTH;
          runOnJS(changeMonth)('next');
          translateX.value = withTiming(0, { duration: 250 });
        });
      } else {
        // Snap back
        translateX.value = withTiming(0, { duration: 250 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animateToPrevMonth = () => {
    translateX.value = withTiming(SCREEN_WIDTH, { duration: 150 }, () => {
      translateX.value = -SCREEN_WIDTH;
      runOnJS(changeMonth)('prev');
      translateX.value = withTiming(0, { duration: 150 });
    });
  };

  const animateToNextMonth = () => {
    translateX.value = withTiming(-SCREEN_WIDTH, { duration: 150 }, () => {
      translateX.value = SCREEN_WIDTH;
      runOnJS(changeMonth)('next');
      translateX.value = withTiming(0, { duration: 150 });
    });
  };

  const generateDays = () => {
    const startOfMonth = currentDate.clone().startOf('iMonth');
    const daysInMonth = currentDate.iDaysInMonth();
    const days = [];
    const startDayOfWeek = startOfMonth.day();

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 0; i < daysInMonth; i++) {
      const day = startOfMonth.clone().add(i, 'days');
      days.push(day);
    }

    while (days.length < 42) {
      days.push(null);
    }

    return days;
  };

  const toArabicNumbers = (str?: string | number | null): string => {
    if (!str) return '';
    return str.toString().replace(/\d/g, (d) => arabicDigits[parseInt(d)]);
  };

  // check is current day is a holiday
  const isHoliday = (day) => {
    if (!day) return false;
    const hijriMonth = day.iMonth();
    const hijriDay = parseInt(day.format('iD'));
    return (
      // Eid al-Fitr: 1 Shawwal
      (hijriMonth === 9 && hijriDay === 1) ||
      // Eid al-Adha: 10 Dhul Hijjah
      (hijriMonth === 11 && hijriDay === 10)
    );
  };

  // Check if the current day is a special day
  const isSpecialDay = (day) => {
    if (!day) return false;
    const m = day.iMonth();
    const d = parseInt(day.format('iD'));
    return specialDays.some((s) => s.month === m && s.day === d);
  };

  // Check if the current day is a subspecial day
  const isSubspecialDay = (day) => {
    if (!day) return false;
    const m = day.iMonth(); // Hijri month (0–11)
    const d = parseInt(day.format('iD')); // Hijri day
    return allSubSpecialDays.some((item) => item.month === m && item.day === d);
  };

  // Check if the current day has a planned activity
  const isActivityPlanned = (day) => {
    if (!day) return false;
    const m = day.iMonth();
    const d = parseInt(day.format('iD'));
    return plannedEvents.some((a) => a.month === m && a.day === d);
  };

  const isSelectedDay = (day) => {
    return selectedDay && day && selectedDay.isSame(day, 'day');
  };

  const handleDayPress = (day) => {
    if (!day) return;

    setSelectedDay(day);

    const m = day.iMonth();
    const d = parseInt(day.format('iD'));

    // Check for holiday
    const holiday = holidays.find((h) => h.month === m && h.day === d);
    if (holiday) {
      console.log(`Holiday: ${holiday.name}`);
      return;
    }

    // Check for a special day
    const special = specialDays.find((s) => s.month === m && s.day === d);
    if (special) {
      console.log(`Special day: ${special.name}`);
      return;
    }

    // Check for subspecial day
    const subSpecial = allSubSpecialDays.find((s) => s.month === m && s.day === d);
    if (subSpecial) {
      console.log(`Special night: ${subSpecial.name}`);
      return;
    }

    // Check for planned activity
    const activityPlanned = isActivityPlanned(day);
    if (activityPlanned) {
      console.log('Planned activity on this day.');
      return;
    }

    // Default
    const hijriDate = day.format('iYYYY/iM/iD');
    const weekdayArray = isArabic ? hijriWeekdaysArabic : hijriWeekdaysTranslit;
    const weekdayName = weekdayArray[day.day()];
    console.log(`Hijri Date: ${hijriDate} - Weekday: ${weekdayName}`);
  };

  const renderCalendarForMonth = () => {
    return (
      <View className="flex-1 bg-[f2f2f2] dark:bg-gray-950 px-4 pt-8">
        {/*Month Navigation*/}
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={animateToPrevMonth}
            className="rounded-md px-2 py-1 active:opacity-50">
            <Text className="text-lg">◀</Text>
          </Pressable>

          <RNText className={`text-gray-700 dark:text-gray-400 text-lg font-bold ${isArabic ? 'font-arabic-primary' : ''}`}>
            {isArabic
              ? `${hijriMonthsArabic[currentDate.iMonth()]} ${toArabicNumbers(currentDate.format('iYYYY'))}`
              : `${hijriMonthsTranslit[currentDate.iMonth()]} ${currentDate.format('iYYYY')}`}
          </RNText>
          <Pressable
            onPress={animateToNextMonth}
            className="rounded-md px-2 py-1 active:opacity-50">
            <Text className="text-lg">▶</Text>
          </Pressable>
        </View>

        {/*Weekday Headers*/}
        <View className="mb-2 flex-row justify-between">
          {(isArabic
            ? hijriWeekdaysArabic
            : !useShortTranslit
              ? hijriWeekDaysTranslitShort
              : hijriWeekdaysTranslit
          ).map((day, index) => (
            <RNText key={index} className={`text-gray-700 dark:text-gray-400 flex-1 text-center text-sm font-bold ${isArabic ? 'font-arabic-primary' : ''}`}>
              {day}
            </RNText>
          ))}
        </View>

        {/*Calendar Grid*/}
        <FlatList
          columnWrapperStyle={{ flex: 1, justifyContent: 'space-around' }}
          showsVerticalScrollIndicator={false}
          numColumns={7}
          data={generateDays()}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => {
            const isToday = item && item.format('iYYYY/iM/iD') === todayHijri;
            const isIslamicHoliday = isHoliday(item);
            const isSpecial = isSpecialDay(item);
            const isSubSpecial = isSubspecialDay(item);

            return (
              <Pressable
                disabled={!item}
                onPress={() => handleDayPress(item)}
                className={`relative flex-1 items-center py-2 ${
                  isSelectedDay(item)
                    ? 'rounded-full bg-app-500'
                    : isIslamicHoliday
                      ? 'rounded-full bg-green-300'
                      : isToday
                        ? 'rounded-full bg-gray-600'
                        : ''
                }`}>
                <RNText className={`text-gray-700 dark:text-gray-400 text-sm ${isArabic ? 'font-arabic-primary' : ''}`}>
                  {item ? (isArabic ? toArabicNumbers(item.format('iD')) : item.format('iD')) : ''}
                </RNText>

                <View className="mt-1 h-2 items-center justify-start">
                  {isSpecial && !isHoliday(item) && (
                    <View className="mt-1 h-[3px] w-4 self-center rounded bg-orange-400" />
                  )}
                  {isSubSpecial && !isHoliday(item) && (
                    <View className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-400" />
                  )}
                  {isActivityPlanned(item) && !isHoliday(item) && (
                    <View className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-700" />
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    );
  };

  /* Events container functionality */

  // Show events in events container for a selected day
  const getDayDetails = () => {
    const day = selectedDay || moment();
    const todayHijri = moment().format('iYYYY/iM/iD');
    const isToday = day.format('iYYYY/iM/iD') === todayHijri;

    const m = day.iMonth();
    const d = parseInt(day.format('iD'));

    const events = [];

    const holiday = holidays.find((h) => h.month === m && h.day === d);
    if (holiday) {
      events.push({
        type: 'holiday',
        label: holiday.name,
        day: holiday.day,
        month: holiday.month,
        name: holiday.name,
        description: holiday.description,
        quote: holiday.quote,
        imageUrl: holiday.imageUrl,
        dateLabel: holiday.dateLabel,
        todos: holiday.todos,
        facts: holiday.facts,
      });
    }

    const special = specialDays.find((s) => s.month === m && s.day === d);
    if (special) {
      events.push({
        type: 'special',
        label: special.name,
        day: special.day,
        month: special.month,
        name: special.name,
        description: special.description,
        quote: special.quote,
        imageUrl: special.imageUrl,
        dateLabel: special.dateLabel,
        todos: special.todos,
        facts: special.facts,
      });
    }

    const subSpecial = allSubSpecialDays.find((s) => s.month === m && s.day === d);
    if (subSpecial) {
      events.push({
        type: 'subspecial',
        label: subSpecial.name,
        day: subSpecial.day,
        month: subSpecial.month,
        name: subSpecial.name,
        description: subSpecial.description,
        quote: subSpecial.quote,
        // imageUrl: subSpecial.imageUrl,
        dateLabel: subSpecial.dateLabel,
        todos: subSpecial.todos,
        facts: subSpecial.facts,
      });
    }

    const plannedEventsFiltered = plannedEvents.filter((e) => e.month === m && e.day === d);
    plannedEventsFiltered.forEach((event) => {
      events.push({
        type: 'planned',
        label: event.description,
        content: '' /* or whatever content */,
      });
    });

    return {
      isToday,
      label: isToday
        ? 'TODAY'
        : `${isArabic ? hijriMonthsArabic[m] : hijriMonthsTranslit[m]} ${isArabic ? toArabicNumbers(d) : d}`,
      events,
    };
  };
  const { label, events } = getDayDetails();

  const renderEvent = ({ item, index }) => {
    const baseDot = 'rounded-full mr-2';
    let dotClass = '';

    if (item.type === 'planned') {
      return (
        <Pressable
          key={index}
          onPress={() => {
            router.push({
              pathname: '/plannedEventInfoModal',
              params: {
                title: item.label,
                content: item.content,
              },
            });
          }}
          className='mb-2'>
          <Card className='p-4'>
              <RNText className={`text-gray-700 dark:text-gray-400 ${isArabic ? 'font-arabic-primary' : ''}`}>{label}</RNText>
              <View className="my-1 flex-row items-center">
                <View className={`${baseDot} h-2 w-2 bg-purple-600`} />
                <Text className="text-lg text-black">{item.label}</Text>
              </View>
          </Card>
        </Pressable>
      );
    }

    switch (item.type) {
      case 'holiday':
        dotClass = 'bg-green-600 w-2 h-2';
        break;
      case 'special':
        dotClass = 'bg-orange-400 w-2 h-2';
        break;
      case 'subspecial':
        dotClass = 'bg-orange-400 w-1.5 h-1.5';
        break;
      default:
        dotClass = 'bg-gray-300 w-2 h-2'; // fallback dot
    }

    return (
      <Pressable
        key={item.type + '-' + index}
        onPress={() => {
          router.push({
            pathname: '/islamicEventInfoModal',
            params: {
              islamicEvent: JSON.stringify(item),
            },
          });
        }}
      className='my-2'>
        <Card className='p-4'>
            <RNText className={`text-gray-700 dark:text-gray-400 ${isArabic ? 'font-arabic-primary' : ''}`}>{label}</RNText>
            <View className="flex-row items-center">
              <View className={`${baseDot} ${dotClass}`} />
              <Text className="text-lg text-black">{item.label}</Text>
            </View>
        </Card>
      </Pressable>
    );
  };

  const goToToday = () => {
    const today = moment();
    setCurrentDate(today);
    setSelectedDay(today);
  };

  return (
    <>
      {/* Calendar Container */}
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[animatedStyle, { flex: 1 }]}>
          {renderCalendarForMonth()}
        </Animated.View>
      </GestureDetector>

      <Divider/>
      {/* Events Container */}
      <View className="flex-1 bg-[f2f2f2] dark:bg-gray-950 px-4">
        <FlatList
          showsVerticalScrollIndicator={false}
          data={events}
          renderItem={renderEvent}
          keyExtractor={(_item, index) => String(index)}
          ListEmptyComponent={<Text className="text-center italic mt-4">No events</Text>}
        />
        <View className="mt-0 items-center justify-center py-2">
          <Button
            className="w-1/3"
            size={'md'}
            variant="primary"
            title="Today"
            onPress={goToToday}
          />
        </View>
      </View>
    </>
  );
}
