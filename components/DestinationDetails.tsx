import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  ChevronDown,
  Globe,
  MessageCircle,
  Lightbulb,
  PlusIcon,
} from "lucide-react";
import Image from "next/image";
import { Destination, Activity } from "@/data/destinations";

interface DestinationDetailsProps {
  destination: Destination;
  selectedActivity?: Activity;
  onActivitySelect: (activity: Activity) => void;
}

const DestinationDetails = memo(
  ({
    destination,
    selectedActivity,
    onActivitySelect,
  }: DestinationDetailsProps) => {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Destination Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {destination.places[0].emoji} {destination.country}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Globe className="w-4 h-4" />
              <span>{destination.language}</span>
              <span>•</span>
              <span>{destination.currency}</span>
            </div>
          </div>
          <p className="text-gray-600">{destination.description}</p>
        </div>

        {/* Travel Tips */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-rose-50 rounded-xl p-4"
        >
          <h4 className="font-semibold text-rose-600 flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4" />
            Travel Tips
          </h4>
          <ul className="space-y-2">
            {destination.generalTips.map((tip, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="w-1 h-1 rounded-full bg-rose-400 mt-2" />
                {tip}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Places */}
        <div className="space-y-4">
          {destination.places.map((place) => (
            <motion.div
              key={place.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-100 rounded-xl p-4 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    {place.emoji} {place.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {place.description}
                  </p>
                </div>
                {place.image && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <Image
                      src={place.image}
                      alt={place.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Activities */}
              <div className="grid gap-3">
                {place.activities.map((activity) => {
                  const isSelected = selectedActivity?.name === activity.name;
                  return (
                    <motion.button
                      key={activity.name}
                      onClick={() => onActivitySelect(activity)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-rose-50 ring-2 ring-rose-500"
                          : "bg-gray-50 hover:bg-rose-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{activity.emoji}</span>
                          <div>
                            <h5 className="font-medium text-gray-800">
                              {activity.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-rose-500 font-semibold">
                              ${activity.price}
                            </div>
                            {activity.duration && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.duration}
                              </div>
                            )}
                          </div>
                          {isSelected ? (
                            <ChevronDown className="w-5 h-5 text-rose-500" />
                          ) : (
                            <PlusIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isSelected && activity.tips && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-rose-100"
                          >
                            <ul className="space-y-2">
                              {activity.tips.map((tip, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-gray-600 flex items-center gap-2"
                                >
                                  <Info className="w-3 h-3 text-rose-400" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                            {activity.bookingUrl && (
                              <a
                                href={activity.bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 text-sm text-blue-500 hover:text-blue-600 inline-flex items-center gap-1"
                              >
                                Book now
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Media Section */}
        {destination.media.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-semibold text-gray-800 mb-3">Travel Guides</h4>
            <div className="grid gap-3">
              {destination.media.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  {item.thumbnail && (
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">{item.title}</h5>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

DestinationDetails.displayName = "DestinationDetails";

export default DestinationDetails;
